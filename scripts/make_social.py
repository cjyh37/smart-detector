"""Optional: regenerate the sharing image on Windows (requires Pillow)."""
from pathlib import Path
import argparse
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser()
parser.add_argument('--lang', choices=('ko', 'en', 'ja'), default='ko')
language = parser.parse_args().lang
copy = {
    'ko': ('스마트 디텍터', '시험 중 새 신호,', '조용한 알림.', '감독관을 위한 무료 Android 앱',
           'Android 12 이상  ·  무료 베타  ·  인터넷 없이 사용', '제1시험실', '수신 중', '시작 후 새 신호', '설명용 화면 예시'),
    'ja': ('Smart Detector', '試験中の新しい信号を', '振動でお知らせ', '試験監督のための無料 Android アプリ', 'Android 12 以降 · オフライン対応', '第1試験室', '受信中', '開始後の新規信号', '画面イメージ'),
    'en': ('Smart Detector', 'New signals.', 'Quiet alerts.', 'A free Android app for exam proctors',
           'Android 12+  ·  Free beta  ·  Works offline', 'Exam room 1', 'Listening', 'New signals since start', 'Illustrative screen'),
}[language]
root = Path(__file__).resolve().parents[1]
image = Image.new('RGB', (1200, 630), '#ffffff')
draw = ImageDraw.Draw(image)
blue, ink, muted = '#0b47b5', '#0e1726', '#526079'


def text(position, message, size, color=ink, bold=False):
    font = ImageFont.truetype(('C:/Windows/Fonts/YuGothB.ttc' if bold else 'C:/Windows/Fonts/YuGothM.ttc') if language == 'ja' else 'C:/Windows/Fonts/malgunbd.ttf' if bold else 'C:/Windows/Fonts/malgun.ttf', size)
    draw.text(position, message, font=font, fill=color, stroke_width=0)


draw.rounded_rectangle((64, 54, 112, 102), radius=10, fill=blue)
draw.arc((74, 68, 102, 94), 220, 320, fill='white', width=3)
draw.arc((80, 76, 96, 90), 220, 320, fill='white', width=3)
draw.ellipse((86, 87, 90, 91), fill='white')
text((127, 58), copy[0], 28, bold=True)
text((64, 195), copy[1], 57, bold=True)
text((64, 278), copy[2], 57, blue, bold=True)
text((66, 390), copy[3], 25, muted)
text((66, 540), copy[4], 18, muted)
draw.rounded_rectangle((740, 100, 1136, 532), radius=16, fill=blue)
text((770, 130), copy[5], 22, '#ffffff', True)
text((770, 188), copy[6], 28, '#ffffff', True)
draw.rounded_rectangle((768, 248, 1108, 454), radius=12, fill='#ffc21a')
text((815 if language == 'en' else 850, 269), copy[7], 22, '#1e1600', True)
text((908, 302), '1', 93, '#1e1600', True)
text((770, 480), copy[8], 18, '#d6e2fb')
filename = f'social-{language}.png' if language != 'ko' else 'social.png'
image.save(root / 'assets' / filename, optimize=True)
print(f'Created assets/{filename} (1200 x 630)')
