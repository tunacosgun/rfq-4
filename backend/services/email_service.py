import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.smtp_username = os.environ.get('SMTP_USERNAME', '')
        self.smtp_password = os.environ.get('SMTP_PASSWORD', '')
        self.from_email = os.environ.get('FROM_EMAIL', self.smtp_username)
        
    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        attachment_data: Optional[bytes] = None,
        attachment_filename: Optional[str] = None
    ) -> bool:
        """Send email with optional PDF attachment"""
        if not self.smtp_username or not self.smtp_password:
            logger.warning(f"Email not sent - SMTP credentials not configured. Would send to: {to_email}")
            logger.info(f"Subject: {subject}")
            logger.info(f"Content: {html_content[:200]}...")
            return False
            
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            if attachment_data and attachment_filename:
                attachment = MIMEApplication(attachment_data, _subtype='pdf')
                attachment.add_header('Content-Disposition', 'attachment', filename=attachment_filename)
                msg.attach(attachment)
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
                
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def send_new_quote_notification(self, quote_data: dict, admin_email: str = None) -> bool:
        """Notify admin about new quote"""
        if not admin_email:
            admin_email = os.environ.get('ADMIN_EMAIL', self.smtp_username)
            
        subject = f"Yeni Teklif Talebi - {quote_data['customer_name']}"
        
        items_html = '<ul>'
        for item in quote_data['items']:
            items_html += f"<li>{item['product_name']} - {item['quantity']} adet</li>"
        items_html += '</ul>'
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2 style="color: #3BB77E;">Yeni Teklif Talebi</h2>
            <p><strong>Müşteri:</strong> {quote_data['customer_name']}</p>
            <p><strong>Firma:</strong> {quote_data.get('company', '-')}</p>
            <p><strong>Email:</strong> {quote_data['email']}</p>
            <p><strong>Telefon:</strong> {quote_data.get('phone', '-')}</p>
            <hr>
            <h3>Talep Edilen Ürünler:</h3>
            {items_html}
            {f"<p><strong>Mesaj:</strong> {quote_data.get('message', '')}</p>" if quote_data.get('message') else ''}
            <hr>
            <p>Admin panelinden teklife fiyat verebilir ve müşteriye gönderebilirsiniz.</p>
        </body>
        </html>
        """
        
        return self.send_email(admin_email, subject, html_content)
    
    def send_quote_response(self, quote_data: dict, pdf_data: Optional[bytes] = None) -> bool:
        """Send quote response to customer"""
        customer_email = quote_data['email']
        
        if quote_data['status'] == 'onaylandi':
            subject = f"Teklifiniz Onaylandı - {quote_data['id'][:8]}"
            status_message = "<p style='color: #3BB77E; font-weight: bold;'>✅ Teklifiniz onaylanmıştır.</p>"
        elif quote_data['status'] == 'reddedildi':
            subject = f"Teklifiniz Hakkında - {quote_data['id'][:8]}"
            status_message = "<p style='color: #FF6B6B;'>Maalesef teklifiniz bu aşamada değerlendirilememiştir.</p>"
        else:
            subject = f"Teklifiniz İnceleniyor - {quote_data['id'][:8]}"
            status_message = "<p>Teklifiniz incelenmektedir. En kısa sürede size dönüş yapacağız.</p>"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2 style="color: #3BB77E;">Teklif Talebiniz Hakkında</h2>
            <p>Sayın {quote_data['customer_name']},</p>
            {status_message}
            {f"<p><strong>Admin Notu:</strong> {quote_data.get('admin_note', '')}</p>" if quote_data.get('admin_note') else ''}
            <hr>
            <p>Detaylı bilgi için ekteki PDF'i inceleyebilirsiniz.</p>
            <p>Sorularınız için bizimle iletişime geçebilirsiniz.</p>
            <br>
            <p>İyi günler dileriz.</p>
        </body>
        </html>
        """
        
        attachment_filename = f"teklif_{quote_data['id'][:8]}.pdf" if pdf_data else None
        return self.send_email(customer_email, subject, html_content, pdf_data, attachment_filename)

email_service = EmailService()