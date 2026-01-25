"""
Generate a two-page, fillable PDF: "CRYPTO WITHDRAWAL REQUEST – CLIENT VERIFICATION FORM".
Uses only ReportLab built-in fonts and draws branding from the repository `public/logos`.

Run: python generate_crypto_withdrawal_form.py
"""

import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
import textwrap


# Theme colors (from site)
PRIMARY = HexColor('#1C0F36')
ACCENT = HexColor('#FF8C37')
BG_LIGHT = HexColor('#F5F6F8')

# Paths
HERE = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.abspath(os.path.join(HERE, '..', 'public', 'logos', 'grantunionsmall.png'))

FOOTER = "Confidential – Grant Union Investment © 2026 | This document is for internal compliance purposes only."

CHECK_OPTIONS = [
    ("USDC (Ethereum)", 0),
    ("USDC (Polygon)", 1),
    ("ETH (Ethereum Mainnet)", 2),
    ("BTC (Bitcoin Network)", 3),
]


def draw_header_footer(c, page_num, page_width, page_height):
    # header band
    band_h = 72  # 1 inch
    c.setFillColor(BG_LIGHT)
    c.rect(0, page_height - band_h, page_width, band_h, fill=1, stroke=0)

    # logo with white backing for contrast
    try:
        logo_w = 84
        logo_h = 84
        logo_x = 48
        logo_y = page_height - band_h + (band_h - logo_h) / 2
        c.setFillColor(white)
        c.rect(logo_x - 6, logo_y - 6, logo_w + 12, logo_h + 12, fill=1, stroke=0)
        c.drawImage(LOGO_PATH, logo_x, logo_y, width=logo_w, height=logo_h, preserveAspectRatio=True, mask='auto')
    except Exception:
        # fallback: site name
        c.setFillColor(PRIMARY)
        c.setFont('Helvetica-Bold', 14)
        c.drawString(48, page_height - 36, 'GRANT UNION INVESTMENT')

    # title in header area
    c.setFillColor(PRIMARY)
    c.setFont('Helvetica-Bold', 16)
    c.drawString(160, page_height - 36, 'GRANT UNION INVESTMENT')
    c.setFont('Helvetica', 9)
    c.drawString(160, page_height - 54, 'Licensed Digital Asset Brokerage | Compliance Department')

    # footer
    c.setFillColor(BG_LIGHT)
    c.rect(0, 0, page_width, 48, fill=1, stroke=0)
    c.setFillColor(PRIMARY)
    c.setFont('Helvetica', 8)
    c.drawString(48, 16, FOOTER)
    c.drawRightString(page_width - 48, 16, f'Page {page_num} of 2')


def create_pdf(filename):
    page_width, page_height = LETTER
    c = canvas.Canvas(filename, pagesize=LETTER)
    form = c.acroForm

    # PAGE 1
    draw_header_footer(c, 1, page_width, page_height)
    # layout constants
    MARGIN = 48
    LABEL_X = MARGIN
    FIELD_X = 220
    FIELD_W = page_width - FIELD_X - MARGIN
    SECTION_SPACING = 18
    LINE_H = 16

    left = MARGIN
    right = page_width - MARGIN
    y = page_height - 120

    c.setFont('Helvetica-Bold', 14)
    c.setFillColor(PRIMARY)
    c.drawCentredString(page_width / 2, y, 'CRYPTO WITHDRAWAL REQUEST – CLIENT VERIFICATION FORM')
    y -= 20
    c.setFont('Helvetica', 10)
    c.setFillColor(HexColor('#333333'))
    intro = ('This form is required to initiate a crypto withdrawal request from a managed investment account under '
             'Grant Union Investment oversight. All fields must be completed accurately to proceed with verification.')
    # wrap intro to fit printable width
    wrapped = textwrap.wrap(intro, width=100)
    for line in wrapped:
        c.drawString(left, y, line)
        y -= LINE_H
    y -= 6
    # separator line under intro
    c.setStrokeColor(BG_LIGHT)
    c.setLineWidth(1)
    c.line(left, y, right, y)
    y -= SECTION_SPACING

    # Client information fields
    field_h = 18
    gap = 10

    def add_label_field(label, name, field_x=FIELD_X, field_w=FIELD_W):
        nonlocal y
        c.setFillColor(PRIMARY)
        c.setFont('Helvetica', 10)
        c.drawString(LABEL_X, y, label)
        form.textfield(name=name, x=field_x, y=y - 4, width=field_w, height=field_h, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
        y -= field_h + gap

    add_label_field('Full Legal Name:', 'full_name')
    add_label_field('Residential Address:', 'address')

    # City / State / ZIP row
    c.drawString(left, y, 'City:')
    form.textfield(name='city', x=left + 40, y=y - 4, width=110, height=field_h, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
    c.drawString(left + 170, y, 'State:')
    form.textfield(name='state', x=left + 210, y=y - 4, width=60, height=field_h, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
    c.drawString(left + 290, y, 'ZIP:')
    form.textfield(name='zip', x=left + 320, y=y - 4, width=90, height=field_h, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
    y -= field_h + gap

    add_label_field('Email:', 'email', field_w=200)
    add_label_field('Phone:', 'phone', field_w=200)
    add_label_field('Government ID Type:', 'id_type', field_w=180)
    add_label_field('ID Number:', 'id_number', field_w=180)

    # Withdrawal details
    c.setFillColor(ACCENT)
    c.setFont('Helvetica-Bold', 11)
    c.drawString(left, y, 'Withdrawal Details:')
    y -= 18
    c.setFillColor(PRIMARY)
    c.setFont('Helvetica', 10)
    c.drawString(left, y, 'Requested Amount: $40,000.00 USD equivalent')
    y -= 16
    c.drawString(left, y, 'Processing Fee: $2,758.20 USD equivalent (mandatory)')
    y -= 18
    c.drawString(left, y, 'Disbursement Method: Cryptocurrency only')
    y -= 18

    c.drawString(left, y, 'Disbursement Preferences:')
    y -= 16
    for label, idx in CHECK_OPTIONS:
        form.checkbox(name=f'crypto_{idx}', x=left + 6, y=y - 2, size=12, borderColor=PRIMARY)
        c.drawString(left + 20, y, label)
        y -= 16

    # receiving wallet
    c.drawString(left, y, 'Receiving Wallet Address:')
    form.textfield(name='wallet_address', x=FIELD_X, y=y - 4, width=FIELD_W, height=field_h, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
    y -= field_h + gap
    form.checkbox(name='wallet_confirmed', x=LABEL_X + 6, y=y - 2, size=12, borderColor=PRIMARY)
    c.drawString(LABEL_X + 20, y, 'I confirm this wallet is under my control and has been tested with a small transaction')
    y -= field_h + gap

    # small separator before signature
    c.setStrokeColor(BG_LIGHT)
    c.line(left, y + gap, right, y + gap)
    y -= 8

    # Signature block
    c.setFillColor(ACCENT)
    c.setFont('Helvetica-Bold', 11)
    c.drawString(left, y, 'Signature Section:')
    y -= 14
    c.setFillColor(PRIMARY)
    # signature aligned with printed name and date
    form.textfield(name='signature', x=FIELD_X, y=y - 4, width=220, height=field_h, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
    c.drawString(FIELD_X + 230, y, 'Printed Name:')
    form.textfield(name='printed_name', x=FIELD_X + 310, y=y - 4, width=180, height=field_h, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
    y -= field_h + gap
    c.drawString(LABEL_X, y, 'Date:')
    form.textfield(name='date', x=LABEL_X + 36, y=y - 4, width=120, height=field_h, borderStyle='underlined', textColor=PRIMARY, fillColor=white)

    c.showPage()

    # PAGE 2
    draw_header_footer(c, 2, page_width, page_height)
    y = page_height - 140
    c.setFont('Helvetica-Bold', 12)
    c.setFillColor(PRIMARY)
    c.drawString(left, y, 'Compliance Acknowledgement')
    y -= 20
    c.setFont('Helvetica', 10)
    c.drawString(left, y, 'By submitting this form, I acknowledge:')
    y -= 18

    bullets = [
        'The requested withdrawal is subject to a mandatory processing fee of $2,758.20',
        'No disbursement will occur until all verification steps are complete',
        'I am solely responsible for the accuracy of the receiving wallet address',
        'Blockchain transactions are irreversible',
        'Grant Union Investment reserves the right to delay or deny requests that fail compliance checks'
    ]
    for b in bullets:
        c.drawString(left + 12, y, f'• {b}')
        y -= 16

    y -= 6
    c.setFont('Helvetica-Bold', 11)
    c.drawString(left, y, 'Verification Protocol:')
    y -= 16

    steps = [
        'Step 1: Submit this form',
        'Step 2: After gas confirmation, send $2,758.20 processing fee to escrow address. Disbursement of $40,000 will follow within 24–48 hours.'
    ]
    c.setFont('Helvetica', 10)
    for s in steps:
        c.drawString(left + 12, y, s)
        y -= 16

    y -= 8
    c.setFont('Helvetica-Bold', 11)
    c.drawString(left, y, 'For Office Use Only (non-fillable):')
    y -= 18
    c.setFont('Helvetica', 10)
    c.drawString(left, y, 'Form Received: ________')
    c.drawString(left + 180, y, 'Test Wallet Issued:')
    form.checkbox(name='test_wallet_issued', x=left + 320, y=y - 2, size=12)
    c.drawString(left + 380, y, 'Fee Confirmed:')
    form.checkbox(name='fee_confirmed', x=left + 450, y=y - 2, size=12)
    y -= 20
    c.drawString(left, y, 'Disbursement Completed:')
    form.checkbox(name='disbursement_completed', x=left + 160, y=y - 2, size=12)
    c.drawString(left + 220, y, 'Compliance Officer: _________________________')

    c.save()


if __name__ == '__main__':
    out = os.path.join(HERE, 'crypto-withdrawal-request-form.pdf')
    create_pdf(out)
