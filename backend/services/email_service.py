import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from typing import Optional
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

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
    
    def send_quote_response(self, quote_data: dict, pdf_data: Optional[bytes] = None, settings: dict = None) -> bool:
        """Send quote response to customer with modern template"""
        customer_email = quote_data['email']
        customer_name = quote_data['customer_name']
        quote_id = quote_data['id'][:8].upper()
        
        # Default settings
        default_settings = {
            'email_header_color': '#e06c1b',
            'email_logo_url': '',
            'company_name': 'Özmen Gıda',
            'quote_email_subject': f'Teklif Talebiniz - #{quote_id}',
            'quote_email_greeting': f'Sayın {customer_name},',
            'quote_email_intro': 'Teklif talebiniz için teşekkür ederiz. Ekteki PDF dosyasında detaylı teklif bilgilerinizi bulabilirsiniz.',
            'quote_email_details_title': 'Teklif Özeti',
            'quote_email_button_text': 'Teklifi Görüntüle',
            'quote_email_footer_note': 'Herhangi bir sorunuz için bizimle iletişime geçmekten çekinmeyin.',
            'quote_email_signature': 'Saygılarımızla,<br>Özmen Gıda Ekibi',
            'email_footer_text': 'Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.',
            'company_phone': '',
            'company_email': '',
            'company_website': ''
        }
        
        # Merge with provided settings
        if settings:
            default_settings.update(settings)
        
        s = default_settings
        
        # Format subject with variables
        subject = s['quote_email_subject'].replace('{quote_id}', quote_id).replace('{customer_name}', customer_name)
        greeting = s['quote_email_greeting'].replace('{customer_name}', customer_name)
        intro = s['quote_email_intro'].replace('{quote_id}', quote_id)
        
        # Build quote summary
        quote_items_html = ''
        if quote_data.get('pricing'):
            quote_items_html = '<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">'
            quote_items_html += '<tr style="background: #f3f4f6;"><th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Ürün</th><th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Miktar</th><th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Fiyat</th></tr>'
            total = 0
            for item in quote_data['pricing']:
                quote_items_html += f'<tr><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">{item["product_name"]}</td><td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">{item["quantity"]} adet</td><td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">₺{item["total_price"]:.2f}</td></tr>'
                total += item['total_price']
            quote_items_html += f'<tr style="background: #f9fafb;"><td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">TOPLAM:</td><td style="padding: 12px; text-align: right; font-weight: bold; color: {s["email_header_color"]}; font-size: 18px;">₺{total:.2f}</td></tr>'
            quote_items_html += '</table>'
        
        # Modern email template
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, {s['email_header_color']} 0%, #c75a14 100%); padding: 40px 30px; text-align: center;">
                                    {f'<img src="{s["email_logo_url"]}" alt="Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">' if s['email_logo_url'] else ''}
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">{s['company_name']}</h1>
                                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Teklif Bildirimi</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">Merhaba!</h2>
                                    <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">{greeting}</p>
                                    <p style="margin: 0 0 25px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">{intro}</p>
                                    
                                    <!-- Quote Details Box -->
                                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid {s['email_header_color']}; padding: 20px; margin: 25px 0; border-radius: 8px;">
                                        <h3 style="margin: 0 0 15px 0; color: {s['email_header_color']}; font-size: 18px; font-weight: 600;">{s['quote_email_details_title']}</h3>
                                        <p style="margin: 0 0 8px 0; color: #374151; font-size: 15px;"><strong>Teklif No:</strong> #{quote_id}</p>
                                        <p style="margin: 0; color: #374151; font-size: 15px;"><strong>Müşteri:</strong> {customer_name}</p>
                                    </div>
                                    
                                    <!-- Products Table -->
                                    {quote_items_html}
                                    
                                    <!-- Note -->
                                    <p style="margin: 25px 0 30px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">{s['quote_email_footer_note']}</p>
                                    
                                    <!-- Signature -->
                                    <div style="margin-top: 40px; padding-top: 25px; border-top: 2px solid #e5e7eb;">
                                        <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">{s['quote_email_signature']}</p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 13px;">{s['email_footer_text']}</p>
                                    {f'<p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>{s["company_name"]}</strong></p>' if s['company_name'] else ''}
                                    {f'<p style="margin: 5px 0; color: #9ca3af; font-size: 13px;">📞 {s["company_phone"]}</p>' if s.get('company_phone') else ''}
                                    {f'<p style="margin: 5px 0; color: #9ca3af; font-size: 13px;">✉️ {s["company_email"]}</p>' if s.get('company_email') else ''}
                                    {f'<p style="margin: 5px 0; color: #9ca3af; font-size: 13px;">🌐 {s["company_website"]}</p>' if s.get('company_website') else ''}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return self.send_email(
            customer_email,
            subject,
            html_content,
            pdf_data,
            f"Teklif_{quote_id}.pdf" if pdf_data else None
        )
    
    def send_password_reset_email(self, email: str, name: str, reset_link: str, settings: dict = None, is_admin: bool = False) -> bool:
        """Send password reset email"""
        s = settings or {}
        company_name = s.get('company_name', 'Özmen Gıda')
        header_color = s.get('email_header_color', '#e06c1b')
        logo_url = s.get('email_logo_url', '')
        
        user_type = "Admin" if is_admin else "Müşteri"
        subject = f"Şifre Sıfırlama Talebi - {company_name}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, {header_color} 0%, #c75a14 100%); padding: 40px 30px; text-align: center;">
                                    {f'<img src="{logo_url}" alt="Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">' if logo_url else ''}
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">{company_name}</h1>
                                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">🔐 Şifre Sıfırlama</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">Merhaba {name}!</h2>
                                    <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                                        {user_type} hesabınız için şifre sıfırlama talebinde bulundunuz.
                                    </p>
                                    <p style="margin: 0 0 25px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                                        Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:
                                    </p>
                                    
                                    <!-- Reset Button -->
                                    <div style="text-align: center; margin: 30px 0;">
                                        <a href="{reset_link}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, {header_color} 0%, #c75a14 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 12px rgba(224, 108, 27, 0.3);">
                                            Şifremi Sıfırla
                                        </a>
                                    </div>
                                    
                                    <!-- Warning Box -->
                                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 25px 0; border-radius: 8px;">
                                        <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.6;">
                                            ⚠️ <strong>Önemli:</strong> Bu link 1 saat geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu emaili görmezden gelebilirsiniz.
                                        </p>
                                    </div>
                                    
                                    <p style="margin: 25px 0 0 0; color: #9ca3af; font-size: 14px; line-height: 1.6;">
                                        Buton çalışmıyorsa şu linki tarayıcınıza kopyalayın:<br>
                                        <a href="{reset_link}" style="color: {header_color}; word-break: break-all;">{reset_link}</a>
                                    </p>
                                    
                                    <!-- Signature -->
                                    <div style="margin-top: 40px; padding-top: 25px; border-top: 2px solid #e5e7eb;">
                                        <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                                            Saygılarımızla,<br>
                                            {company_name} Ekibi
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0; color: #9ca3af; font-size: 13px;">Bu email otomatik olarak gönderilmiştir.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return self.send_email(email, subject, html_content)

email_service = EmailService()