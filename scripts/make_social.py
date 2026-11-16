"""Optional: regenerate the sharing image on Windows (requires Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
image = Image.new('RGB', (1200, 630), '#ffffff')
draw = ImageDraw.Draw(image)
blue, ink, muted = '#0b47b5', '#0e1726', '#526079'


def text(position, message, size, color=ink, bold=False):
    font = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf' if bold else 'C:/Windows/Fonts/malgun.ttf', size)
    draw.text(position, message, font=font, fill=color, stroke_width=0)


draw.rounded_rectangle((64, 54, 112, 102), radius=10, fill=blue)
draw.arc((74, 68, 102, 94), 220, 320, fill='white', width=3)
draw.arc((80, 76, 96, 90), 220, 320, fill='white', width=3)
draw.ellipse((86, 87, 90, 91), fill='white')
text((127, 58), '스마트 디텍터', 28, bold=True)
text((64, 195), '시험 중 새 신호,', 57, bold=True)
text((64, 278), '조용한 알림.', 57, blue, bold=True)
text((66, 390), '감독관을 위한 무료 Android 앱', 25, muted)
text((66, 540), 'Android 12 이상  ·  무료 베타  ·  인터넷 없이 사용', 18, muted)
draw.rounded_rectangle((740, 100, 1136, 532), radius=16, fill=blue)
text((770, 130), '제1시험실', 22, '#ffffff', True)
text((770, 188), '수신 중', 28, '#ffffff', True)
draw.rounded_rectangle((768, 248, 1108, 454), radius=12, fill='#ffc21a')
text((850, 269), '시작 후 새 신호', 22, '#1e1600', True)
text((908, 302), '1', 93, '#1e1600', True)
text((770, 480), '설명용 화면 예시', 18, '#d6e2fb')
image.save(root / 'assets' / 'social.png', optimize=True)
print('Created assets/social.png (1200 x 630)')
