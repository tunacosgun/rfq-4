from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle,
    Paragraph, Spacer
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
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
            self.font_name = 'DejaVu'
            self.font_bold = 'DejaVu-Bold'

        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontName=self.font_bold,
            fontSize=24,
            textColor=colors.HexColor('#0EA5E9'),
            spaceAfter=12,
            alignment=TA_CENTER
        ))

        self.styles.add(ParagraphStyle(
            name='CustomHeading',
            parent=self.styles['Heading2'],
            fontName=self.font_bold,
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#253D4E'),
            spaceAfter=6,
            spaceBefore=14
        ))

        self.styles.add(ParagraphStyle(
            name='CustomNormal',
            parent=self.styles['Normal'],
            fontName=self.font_name,
            fontSize=10,
            leading=13,
            textColor=colors.HexColor('#1E293B')
        ))

        self.styles.add(ParagraphStyle(
            name='CustomSmall',
            parent=self.styles['Normal'],
            fontName=self.font_name,
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor('#64748B')
        ))

        # Küçük gri section label (örn: “ŞARTLAR VE KOŞULLAR” alt açıklama)
        self.styles.add(ParagraphStyle(
            name='SectionLabel',
            parent=self.styles['Normal'],
            fontName=self.font_bold,
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor('#9CA3AF'),
            spaceAfter=3,
            spaceBefore=10,
            uppercase=True
        ))

        # İmza alanı için
        self.styles.add(ParagraphStyle(
            name='SignatureLabel',
            parent=self.styles['Normal'],
            fontName=self.font_bold,
            fontSize=9,
            textColor=colors.HexColor('#111827'),
            alignment=TA_CENTER,
            spaceAfter=2
        ))
        self.styles.add(ParagraphStyle(
            name='SignatureHint',
            parent=self.styles['Normal'],
            fontName=self.font_name,
            fontSize=8,
            textColor=colors.HexColor('#6B7280'),
            alignment=TA_CENTER
        ))

    # --------------------------------------------------
    #  ANA FONKSİYON
    # --------------------------------------------------
    def generate_quote_pdf(
        self,
        quote_data: dict,
        pricing_data: Optional[List[Dict]] = None,
        company_settings: Optional[dict] = None
    ) -> bytes:
        """Generate professional quote PDF"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            topMargin=20 * mm,
            bottomMargin=20 * mm,
            leftMargin=18 * mm,
            rightMargin=18 * mm
        )

        story = []

        # ------------------------------------------------------------------
        # BAŞLIK
        # ------------------------------------------------------------------
        title = Paragraph("TEKLİF FORMU", self.styles['CustomTitle'])
        story.append(title)
        story.append(Spacer(1, 6 * mm))

        # ------------------------------------------------------------------
        # TEKLİF / DURUM BİLGİLERİ
        # ------------------------------------------------------------------
        status_text = self._get_status_text(quote_data['status'])
        status_bg, status_fg = self._get_status_colors(quote_data['status'])

        quote_info_data = [
            ['Teklif No:', quote_data['id'][:8].upper()],
            ['Tarih:', datetime.fromisoformat(quote_data['created_at']).strftime('%d.%m.%Y')],
            ['Durum:', status_text],
        ]

        quote_info_table = Table(quote_info_data, colWidths=[35 * mm, 85 * mm])
        ts = TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), self.font_name),
            ('FONTSIZE', (0, 0), (-1, -1), 9.5),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#6B7280')),
            ('FONTNAME', (0, 0), (0, -1), self.font_bold),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ])

        # 3. satırdaki durum hücresini renkli rozet gibi yap
        ts.add('BACKGROUND', (1, 2), (1, 2), status_bg)
        ts.add('TEXTCOLOR', (1, 2), (1, 2), status_fg)
        ts.add('FONTNAME', (1, 2), (1, 2), self.font_bold)
        ts.add('ALIGN', (1, 2), (1, 2), 'CENTER')
        ts.add('LEFTPADDING', (1, 2), (1, 2), 8)
        ts.add('RIGHTPADDING', (1, 2), (1, 2), 8)
        ts.add('TOPPADDING', (1, 2), (1, 2), 3)
        ts.add('BOTTOMPADDING', (1, 2), (1, 2), 3)
        ts.add('BOX', (1, 2), (1, 2), 0.5, status_bg)

        quote_info_table.setStyle(ts)
        story.append(quote_info_table)
        story.append(Spacer(1, 5 * mm))

        # ------------------------------------------------------------------
        # MÜŞTERİ BİLGİLERİ
        # ------------------------------------------------------------------
        story.append(Paragraph("MÜŞTERİ BİLGİLERİ", self.styles['CustomHeading']))

        customer_data = [
            ['Ad Soyad:', quote_data['customer_name']],
            ['Firma:', quote_data.get('company', '-')],
            ['E-posta:', quote_data['email']],
            ['Telefon:', quote_data.get('phone', '-')]
        ]

        customer_table = Table(customer_data, colWidths=[35 * mm, 120 * mm])
        customer_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), self.font_name),
            ('FONTSIZE', (0, 0), (-1, -1), 9.5),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#6B7280')),
            ('FONTNAME', (0, 0), (0, -1), self.font_bold),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(customer_table)
        story.append(Spacer(1, 4 * mm))

        # ------------------------------------------------------------------
        # ÜRÜNLER TABLOSU
        # ------------------------------------------------------------------
        story.append(Paragraph("TALEP EDİLEN ÜRÜNLER", self.styles['CustomHeading']))

        table_data = [['Ürün Adı', 'Miktar', 'Birim Fiyat', 'Toplam']]

        total_amount = 0

        for item in quote_data['items']:
            product_name = item['product_name']
            quantity = item['quantity']

            unit_price = '-'
            item_total = '-'

            if pricing_data:
                pricing_item = next(
                    (p for p in pricing_data if p['product_id'] == item['product_id']),
                    None
                )
                if pricing_item:
                    unit_price = f"{pricing_item['unit_price']:.2f} TL"
                    item_total_val = pricing_item['unit_price'] * quantity
                    item_total = f"{item_total_val:.2f} TL"
                    total_amount += item_total_val

            table_data.append([product_name, str(quantity), unit_price, item_total])

        if pricing_data and total_amount > 0:
            table_data.append(['', '', 'TOPLAM:', f"{total_amount:.2f} TL"])

        products_table = Table(
            table_data,
            colWidths=[80 * mm, 25 * mm, 35 * mm, 35 * mm]
        )
        products_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3BB77E')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
            ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), self.font_bold),
            ('FONTSIZE', (0, 0), (-1, 0), 10.5),

            ('FONTNAME', (0, 1), (-1, -1), self.font_name),
            ('FONTSIZE', (0, 1), (-1, -1), 9.5),

            ('BOTTOMPADDING', (0, 0), (-1, 0), 7),
            ('TOPPADDING', (0, 0), (-1, 0), 7),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
            ('TOPPADDING', (0, 1), (-1, -1), 5),

            ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#E5E7EB')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2 if pricing_data else -1),
             [colors.white, colors.HexColor('#F9FAFB')]),
        ]))

        if pricing_data and total_amount > 0:
            products_table.setStyle(TableStyle([
                ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#FEF3C7')),
                ('FONTNAME', (0, -1), (-1, -1), self.font_bold),
                ('FONTSIZE', (0, -1), (-1, -1), 11),
                ('ALIGN', (2, -1), (3, -1), 'RIGHT')
            ]))

        story.append(products_table)

        # ------------------------------------------------------------------
        # MESAJ / YÖNETİCİ NOTLARI
        # ------------------------------------------------------------------
        if quote_data.get('message'):
            story.append(Paragraph("MÜŞTERİ MESAJI", self.styles['CustomHeading']))
            message_para = Paragraph(
                quote_data['message'],
                self.styles['CustomNormal']
            )
            story.append(message_para)

        if quote_data.get('admin_note'):
            story.append(Paragraph("YÖNETİCİ NOTU", self.styles['CustomHeading']))
            note_para = Paragraph(
                quote_data['admin_note'],
                self.styles['CustomNormal']
            )
            story.append(note_para)

        story.append(Spacer(1, 6 * mm))

        # ------------------------------------------------------------------
        # ŞARTLAR & KOŞULLAR
        # ------------------------------------------------------------------
        story.append(Paragraph("ŞARTLAR VE KOŞULLAR", self.styles['CustomHeading']))

        default_terms = [
            "Bu teklif, düzenlenme tarihinden itibaren 30 gün geçerlidir.",
            "Stok ve piyasa koşullarına bağlı olarak fiyatlarda değişiklik yapılabilir.",
            "Teslimat ve ödeme koşulları, sipariş onayı sırasında netleştirilecektir."
        ]

        terms = company_settings.get('terms') if company_settings else None
        if not terms:
            terms = default_terms

        for idx, term in enumerate(terms, start=1):
            bullet = f"{idx}. {term}"
            story.append(Paragraph(bullet, self.styles['CustomSmall']))

        story.append(Spacer(1, 10 * mm))

        # ------------------------------------------------------------------
        # İMZA ALANI
        # ------------------------------------------------------------------
        story.append(Paragraph("ONAY & İMZA", self.styles['SectionLabel']))

        company_name = (company_settings or {}).get(
            'company_name',
            'Teklifi Hazırlayan'
        )

        signature_data = [
            [
                Paragraph(company_name, self.styles['SignatureLabel']),
                Paragraph("Müşteri Onayı", self.styles['SignatureLabel'])
            ],
            [
                Paragraph("İsim / Kaşe / İmza", self.styles['SignatureHint']),
                Paragraph("İsim / Kaşe / İmza", self.styles['SignatureHint'])
            ],
            [
                "_______________________________",
                "_______________________________"
            ]
        ]

        signature_table = Table(
            signature_data,
            colWidths=[85 * mm, 85 * mm]
        )
        signature_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))

        story.append(signature_table)
        story.append(Spacer(1, 8 * mm))

        # ------------------------------------------------------------------
        # ALT BİLGİ / FOOTER
        # ------------------------------------------------------------------
        footer_lines = []

        footer_lines.append(
            "Bu doküman, bilgi amaçlı hazırlanmış olup elektronik ortamda oluşturulmuştur."
        )

        if company_settings:
            contact_bits = []
            if company_settings.get('phone'):
                contact_bits.append(f"Tel: {company_settings['phone']}")
            if company_settings.get('email'):
                contact_bits.append(f"E-posta: {company_settings['email']}")
            if company_settings.get('website'):
                contact_bits.append(company_settings['website'])

            if contact_bits:
                footer_lines.append(" | ".join(contact_bits))

        footer_text = "<br/>".join(
            [f"<font size='8' color='#9CA3AF'>{line}</font>"
             for line in footer_lines]
        )
        story.append(Paragraph(f"<para align='center'>{footer_text}</para>",
                               self.styles['CustomSmall']))

        # PDF oluştur
        doc.build(story)

        pdf_data = buffer.getvalue()
        buffer.close()
        return pdf_data

    # --------------------------------------------------
    #  YARDIMCI FONKSİYONLAR
    # --------------------------------------------------
    def _get_status_text(self, status: str) -> str:
        """Get Turkish status text"""
        status_map = {
            'beklemede': 'Beklemede',
            'inceleniyor': 'İnceleniyor',
            'fiyat_verildi': 'Fiyat Verildi',
            'onaylandi': 'Onaylandı',
            'reddedildi': 'Reddedildi'
        }
        return status_map.get(status, 'Beklemede')

    def _get_status_colors(self, status: str):
        """Duruma göre arka plan / yazı rengi"""
        status = (status or '').lower()
        if status == 'onaylandi':
            return colors.HexColor('#DCFCE7'), colors.HexColor('#15803D')
        if status == 'fiyat_verildi':
            return colors.HexColor('#DBEAFE'), colors.HexColor('#1D4ED8')
        if status == 'inceleniyor':
            return colors.HexColor('#FEF9C3'), colors.HexColor('#CA8A04')
        if status == 'reddedildi':
            return colors.HexColor('#FEE2E2'), colors.HexColor('#B91C1C')
        # beklemede vs.
        return colors.HexColor('#E5E7EB'), colors.HexColor('#374151')


pdf_service = PDFService()