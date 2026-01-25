"""
Generate a two-page, fillable PDF:
"CONFIDENTIAL CRYPTO WITHDRAWAL AUTHORIZATION – TWO STEP VERIFICATION"
for Grant Union Investment.

Run: python generate_confidential_withdrawal_authorization.py
"""

import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white


# Config
PRIMARY = HexColor('#000000')  # use black for text for a clean professional look
BG_LIGHT = HexColor('#F5F6F8')
FONT_NAME = 'Helvetica'
FONT_SIZE = 11

HERE = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.abspath(os.path.join(HERE, '..', 'public', 'logos', 'grantunionsmall.png'))

FOOTER = 'Confidential – Grant Union Investment © 2026'


def draw_header_footer(c, page_num, page_width, page_height):
    # Header
    c.setFillColor(BG_LIGHT)
    c.rect(0, page_height - 72, page_width, 72, fill=1, stroke=0)
    c.setFillColor(PRIMARY)
    c.setFont(FONT_NAME, FONT_SIZE)
    header_text = 'GRANT UNION INVESTMENT | Private Digital Asset Brokerage'
    c.drawString(48, page_height - 40, header_text)

    # Footer
    c.setFillColor(BG_LIGHT)
    c.rect(0, 0, page_width, 48, fill=1, stroke=0)
    c.setFillColor(PRIMARY)
    c.setFont(FONT_NAME, 9)
    c.drawString(48, 16, FOOTER)
    c.drawRightString(page_width - 48, 16, f'Page {page_num} of 2')


def create_pdf(filename):
    page_w, page_h = LETTER
    c = canvas.Canvas(filename, pagesize=LETTER)
    form = c.acroForm

    left = 48
    field_x = 300
    field_w = page_w - field_x - left
    y = page_h - 110
    line_h = FONT_SIZE + 6

    # Page 1
    draw_header_footer(c, 1, page_w, page_h)
    c.setFont(FONT_NAME, FONT_SIZE + 1)
    c.setFillColor(PRIMARY)
    c.drawString(left, y, 'CONFIDENTIAL CRYPTO WITHDRAWAL AUTHORIZATION – TWO STEP VERIFICATION')
    y -= 28

    c.setFont(FONT_NAME, FONT_SIZE)
    def add_field(label, name, width=field_w):
        nonlocal y
        c.drawString(left, y, f'{label}')
        form.textfield(name=name, x=field_x, y=y - 4, width=width, height=FONT_SIZE + 6, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
        y -= line_h

    add_field('Full Legal Name:', 'full_name')
    add_field('Street Address:', 'street_address')

    # City / State / ZIP inline
    c.drawString(left, y, 'City:')
    form.textfield(name='city', x=left + 90, y=y - 4, width=120, height=FONT_SIZE + 6, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
    c.drawString(left + 220, y, 'State:')
    form.textfield(name='state', x=left + 270, y=y - 4, width=80, height=FONT_SIZE + 6, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
    c.drawString(left + 360, y, 'ZIP:')
    form.textfield(name='zip', x=left + 400, y=y - 4, width=120, height=FONT_SIZE + 6, borderStyle='underlined', textColor=PRIMARY, fillColor=white)
    y -= line_h

    add_field('Phone Number:', 'phone')
    add_field('Email Address:', 'email')
    add_field('Type of Government ID:', 'id_type')
    add_field('ID Number:', 'id_number')

    # Crypto options as checkboxes (labels without bullets)
    c.drawString(left, y, 'Select Network:')
    y -= line_h
    def add_checkbox(label, name):
        nonlocal y
        form.checkbox(name=name, x=left + 6, y=y - 2, size=12)
        c.drawString(left + 24, y, label)
        y -= line_h

    add_checkbox('USDC on Ethereum (ERC-20)', 'opt_usdc_eth')
    add_checkbox('USDC on Polygon', 'opt_usdc_poly')
    add_checkbox('ETH on Ethereum Mainnet', 'opt_eth')
    add_checkbox('BTC on Bitcoin Network', 'opt_btc')

    add_field('Receiving Wallet Address:', 'wallet_address')
    # confirm ownership checkbox
    form.checkbox(name='wallet_owner_confirmed', x=left + 6, y=y - 2, size=12)
    c.drawString(left + 24, y, 'I confirm I own and control this wallet and have tested it')
    y -= line_h * 1.5

    # signature block
    add_field('Beneficiary Signature:', 'benef_sig', width=250)
    add_field('Printed Name:', 'benef_printed', width=250)
    add_field('Date:', 'benef_date', width=150)

    c.showPage()

    # Page 2
    draw_header_footer(c, 2, page_w, page_h)
    y = page_h - 110
    c.setFont(FONT_NAME, FONT_SIZE)
    # checkboxes with statements (no bullets/dashes)
    def add_statement_checkbox(text, name):
        nonlocal y
        form.checkbox(name=name, x=left + 6, y=y - 2, size=12)
        c.drawString(left + 24, y, text)
        y -= line_h

    add_statement_checkbox("I understand this disbursement is from Austin Richard’s account", 'stmt_from_account')
    add_statement_checkbox('I accept full responsibility for wallet accuracy', 'stmt_wallet_resp')
    add_statement_checkbox('I agree not to hold Grant Union Investment liable for user error', 'stmt_no_liability')
    add_statement_checkbox('I consent to record retention for compliance', 'stmt_record_retention')

    y -= line_h
    # Static non-fillable text lines (exact sentences, no bullets)
    static_lines = [
        'Step One: Send exactly $20.00 in crypto (ETH, USDC, or BTC) to a test wallet we’ll provide after form submission.',
        'Step Two: After gas confirmation, send $2,758.20 processing fee to escrow address.',
        'Disbursement of $40,000 will follow within 24–48 hours.',
        'All communications will come from no-reply@grantunion.online.',
        'Blockchain transactions are irreversible.'
    ]
    for line in static_lines:
        c.drawString(left, y, line)
        y -= line_h

    y -= line_h
    # FOR OFFICE USE ONLY (non-fillable checkboxes drawn as boxes)
    c.setFont(FONT_NAME, FONT_SIZE)
    c.drawString(left, y, 'FOR OFFICE USE ONLY')
    y -= line_h

    def draw_box_label(label):
        nonlocal y
        # draw empty box
        c.rect(left + 6, y - 10, 12, 12, fill=0)
        c.drawString(left + 24, y, label)
        y -= line_h

    draw_box_label('Gas Test Wallet Issued')
    draw_box_label('Processing Fee Confirmed')
    draw_box_label('Disbursement Completed')
    draw_box_label('Compliance Verified (signature): _________________________')

    c.save()


if __name__ == '__main__':
    out = os.path.join(HERE, 'confidential-crypto-withdrawal-authorization.pdf')
    create_pdf(out)
