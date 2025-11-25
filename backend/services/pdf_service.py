from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from typing import List, Dict, Optional
import logging
import os

logger = logging.getLogger(__name__)

class PDFService:
    def __init__(self):
        # Register Turkish-compatible font
        try:
            # Use DejaVu Sans which supports Turkish characters
            font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
            font_bold_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
            
            if os.path.exists(font_path):
                pdfmetrics.registerFont(TTFont('DejaVu', font_path))
            if os.path.exists(font_bold_path):
                pdfmetrics.registerFont(TTFont('DejaVu-Bold', font_bold_path))
            
            self.font_name = 'DejaVu'
            self.font_bold = 'DejaVu-Bold'
        except Exception as e:
            logger.warning(f"Could not load DejaVu font: {e}, using Helvetica")
            self.font_name = 'Helvetica'
            self.font_bold = 'Helvetica-Bold'
        
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#3BB77E'),
            spaceAfter=12,
            alignment=TA_CENTER
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#253D4E'),
            spaceAfter=8,
            spaceBefore=12
        ))
    
    def generate_quote_pdf(self, quote_data: dict, pricing_data: Optional[List[Dict]] = None) -> bytes:
        """Generate professional quote PDF"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=20*mm, bottomMargin=20*mm)
        
        story = []
        
        # Title
        title = Paragraph("TEKLİF FORMU", self.styles['CustomTitle'])
        story.append(title)
        story.append(Spacer(1, 10*mm))
        
        # Quote Info
        quote_info_data = [
            ['Teklif No:', quote_data['id'][:8].upper()],
            ['Tarih:', datetime.fromisoformat(quote_data['created_at']).strftime('%d.%m.%Y')],
            ['Durum:', self._get_status_text(quote_data['status'])]
        ]
        
        quote_info_table = Table(quote_info_data, colWidths=[40*mm, 80*mm])
        quote_info_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#7E7E7E')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(quote_info_table)
        story.append(Spacer(1, 8*mm))
        
        # Customer Info
        story.append(Paragraph("MÜŞTERİ BİLGİLERİ", self.styles['CustomHeading']))
        
        customer_data = [
            ['Ad Soyad:', quote_data['customer_name']],
            ['Firma:', quote_data.get('company', '-')],
            ['Email:', quote_data['email']],
            ['Telefon:', quote_data.get('phone', '-')]
        ]
        
        customer_table = Table(customer_data, colWidths=[40*mm, 120*mm])
        customer_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#7E7E7E')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(customer_table)
        story.append(Spacer(1, 8*mm))
        
        # Products Table
        story.append(Paragraph("TALEP EDİLEN ÜRÜNLER", self.styles['CustomHeading']))
        
        # Table headers
        table_data = [['Ürün Adı', 'Miktar', 'Birim Fiyat', 'Toplam']]
        
        total_amount = 0
        
        for item in quote_data['items']:
            product_name = item['product_name']
            quantity = item['quantity']
            
            # Check if pricing data exists
            unit_price = '-'
            item_total = '-'
            
            if pricing_data:
                pricing_item = next((p for p in pricing_data if p['product_id'] == item['product_id']), None)
                if pricing_item:
                    unit_price = f"{pricing_item['unit_price']:.2f} TL"
                    item_total_val = pricing_item['unit_price'] * quantity
                    item_total = f"{item_total_val:.2f} TL"
                    total_amount += item_total_val
            
            table_data.append([product_name, str(quantity), unit_price, item_total])
        
        # Add total row if pricing exists
        if pricing_data and total_amount > 0:
            table_data.append(['', '', 'TOPLAM:', f"{total_amount:.2f} TL"])
        
        products_table = Table(table_data, colWidths=[70*mm, 30*mm, 35*mm, 35*mm])
        products_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3BB77E')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2 if pricing_data else -1), [colors.white, colors.HexColor('#F4F6FA')]),
        ]))
        
        # Bold and highlighted total row
        if pricing_data and total_amount > 0:
            products_table.setStyle(TableStyle([
                ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#FFF9E6')),
                ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, -1), (-1, -1), 12),
            ]))
        
        story.append(products_table)
        story.append(Spacer(1, 8*mm))
        
        # Message
        if quote_data.get('message'):
            story.append(Paragraph("MÜŞTERİ MESAJI", self.styles['CustomHeading']))
            message_para = Paragraph(quote_data['message'], self.styles['Normal'])
            story.append(message_para)
            story.append(Spacer(1, 8*mm))
        
        # Admin Note
        if quote_data.get('admin_note'):
            story.append(Paragraph("YÖNETİCİ NOTU", self.styles['CustomHeading']))
            note_para = Paragraph(quote_data['admin_note'], self.styles['Normal'])
            story.append(note_para)
            story.append(Spacer(1, 8*mm))
        
        # Footer
        story.append(Spacer(1, 15*mm))
        footer_text = "<para align='center'><font size='9' color='#7E7E7E'>Bu teklif 30 gün geçerlidir. Daha fazla bilgi için bizimle iletişime geçiniz.</font></para>"
        story.append(Paragraph(footer_text, self.styles['Normal']))
        
        # Build PDF
        doc.build(story)
        
        pdf_data = buffer.getvalue()
        buffer.close()
        
        return pdf_data
    
    def _get_status_text(self, status: str) -> str:
        """Get Turkish status text"""
        status_map = {
            'beklemede': 'Beklemede',
            'inceleniyor': 'İnceleniyor',
            'fiyat_verildi': 'Fiyat Verildi',
            'onaylandi': 'Onaylandı',
            'reddedildi': 'Reddedildi'
        }
        return status_map.get(status, status.title())

pdf_service = PDFService()