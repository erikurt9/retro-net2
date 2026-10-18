"""Genera los GIF animados de RETRO-NET en public/gifs.  Uso: python3 tools/make_gifs.py"""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'gifs')
os.makedirs(OUT, exist_ok=True)
F = '/usr/share/fonts/truetype/dejavu/'
rnd = np.random.default_rng(7)
random.seed(7)

def font(name, size):
    try: return ImageFont.truetype(F + name, size)
    except OSError: return ImageFont.load_default(size)

def to_p(im):
    """RGBA -> paleta con índice 255 transparente."""
    p = im.convert('RGB').quantize(colors=255, dither=Image.Dither.NONE)
    p.paste(255, im.getchannel('A').point(lambda a: 255 if a < 128 else 0))
    return p

def save(name, frames, ms, alpha=False):
    if alpha:
        ps = [to_p(f) for f in frames]
        ps[0].save(os.path.join(OUT, name), save_all=True, append_images=ps[1:], duration=ms, loop=0, transparency=255, disposal=2)
    else:
        frames[0].save(os.path.join(OUT, name), save_all=True, append_images=frames[1:], duration=ms, loop=0, optimize=True)
    print(name, os.path.getsize(os.path.join(OUT, name)) // 1024, 'KB', len(frames), 'frames')

def blank(w, h): return Image.new('RGBA', (w, h), (0, 0, 0, 0))

# 1) Estática de TV (ruido en escala de grises)
save('static.gif', [Image.fromarray(rnd.integers(0, 256, (135, 240), dtype=np.uint8), 'L') for _ in range(8)], 70)

# 2) Pac-Man comiendo
fr = []
for m in [50, 25, 2, 25]:
    im = blank(64, 64); d = ImageDraw.Draw(im)
    if m <= 3: d.ellipse((4, 4, 59, 59), fill='#F4B251', outline='#2A211C', width=3)
    else: d.pieslice((4, 4, 59, 59), m, 360 - m, fill='#F4B251', outline='#2A211C', width=3)
    d.ellipse((30, 14, 38, 22), fill='#2A211C'); fr.append(im)
save('pacman.gif', fr, 90, True)

# 3) Carrete de cassette girando (+ imagen fija)
def reel(a):
    im = blank(60, 60); d = ImageDraw.Draw(im)
    d.ellipse((1, 1, 58, 58), fill='#1A1817', outline='#F4B251', width=3)
    d.ellipse((20, 20, 39, 39), fill='#F5EFEB')
    for k in range(6):
        t = math.radians(a + k * 60)
        c, s = math.cos(t), math.sin(t)
        pts = [(30 + c * 21 - s * 3, 30 + s * 21 + c * 3), (30 + c * 21 + s * 3, 30 + s * 21 - c * 3), (30 + c * 10 + s * 3, 30 + s * 10 - c * 3), (30 + c * 10 - s * 3, 30 + s * 10 + c * 3)]
        d.polygon(pts, fill='#F5EFEB')
    return im
rf = [reel(i * 5) for i in range(12)]
save('reel.gif', rf, 60, True); rf[0].save(os.path.join(OUT, 'reel-still.png'))

# 4) Ecualizador (+ imagen fija)
def eq(i, still=False):
    im = blank(48, 28); d = ImageDraw.Draw(im)
    for b in range(6):
        h = 4 if still else int(5 + 21 * (0.5 + 0.5 * math.sin(2 * math.pi * i / 10 + b * 1.3)))
        d.rectangle((b * 8, 27 - h, b * 8 + 5, 27), fill='#E05A47')
    return im
save('eq.gif', [eq(i) for i in range(10)], 90, True); eq(0, True).save(os.path.join(OUT, 'eq-still.png'))

# 5) Banda de tracking VHS (fondo negro; se usa con mix-blend-screen)
fr = []
for i in range(30):
    a = np.zeros((135, 240), np.uint8)
    y = int(i / 30 * 175) - 20
    for r in range(max(0, y), min(135, y + 18)):
        a[r] = np.clip(60 + rnd.integers(0, 90, 240), 0, 255)
    if 0 <= y + 18 < 135:
        a[y + 18: y + 22, :] = rnd.integers(0, 255, (min(4, 135 - y - 18), 240))
    fr.append(Image.fromarray(a, 'L'))
save('tracking.gif', fr, 100)

# 6) Indicador REC parpadeante
fr = []
for on in (1, 0):
    im = blank(84, 28); d = ImageDraw.Draw(im)
    if on:
        d.ellipse((4, 6, 20, 22), fill='#E5321F'); d.text((28, 3), 'REC', font=font('DejaVuSansMono-Bold.ttf', 20), fill='#E5321F')
    fr.append(im)
save('rec.gif', fr, 500, True)

# 7) Letrero LED desplazable
txt = '★ BIENVENIDO A RETRO-NET ★ REBOBINA ANTES DE DEVOLVER ★ INSERTA UNA CINTA Y PRESIONA PLAY ★ SIGUE EL ARCOÍRIS ★   '
fm = font('DejaVuSansMono-Bold.ttf', 20); tw = int(fm.getlength(txt))
strip = Image.new('RGB', (tw * 3, 28), '#1A1817'); ds = ImageDraw.Draw(strip)
for k in range(3): ds.text((k * tw, 2), txt, font=fm, fill='#F4B251')
save('marquee.gif', [strip.crop((s, 0, s + 1200, 28)) for s in range(0, tw, 16)], 60)

# 8) Arcoíris ondulante (fondo transparente)
cols = ['#C23B22', '#E05A47', '#F4B251', '#6FA35A', '#3A8B88', '#6b3fa0']
fr = []
for f in range(16):
    im = blank(600, 150); d = ImageDraw.Draw(im)
    for k, c in enumerate(cols):
        dy = 6 * math.sin(2 * math.pi * f / 16 + k * 0.7)
        for j in range(1201):
            t = j / 1200
            x = -25 + 50 * t + 600 * t - 600 * t * t + 625 * t * t
            y = (1 - t) ** 2 * (85 + k * 9) + 2 * t * (1 - t) * (-30 + k * 9) + t * t * (85 + k * 9) + dy
            d.line((x, y - 4, x, y + 4), fill=c)
    fr.append(im)
save('rainbow.gif', fr, 100, True)

# 9) Logo con glitch ocasional
fl = font('DejaVuSerif-Bold.ttf', 34); T = 'RETRO-NET.EXE'
def logo(g=0):
    im = blank(330, 48)
    if g:
        for dx, col in ((4, '#E05A47'), (-4, '#3A8B88')):
            ImageDraw.Draw(im).text((8 + dx * g, 4), T, font=fl, fill=col)
    ImageDraw.Draw(im).text((8, 4), T, font=fl, fill='#2A211C')
    if g:
        band = im.crop((0, 14, 330, 26)); im.paste(blank(330, 12), (0, 14)); im.paste(band, (6 * g, 14))
    return im
fr, ms = [logo()], [2200]
for g in (1, -1, 2, 1): fr.append(logo(g)); ms.append(70)
save('logo.gif', fr, ms, True)

# 10) Línea de ruta (guiones que avanzan) para el timeline de Ruta de Mochileros
fr = []
for off in (0, 6, 12, 18):
    im = blank(8, 24); d = ImageDraw.Draw(im)
    for y in range(-24, 48, 24): d.rectangle((2, y + off, 5, y + off + 11), fill='#E05A47')
    fr.append(im)
save('route.gif', fr, 140, True)
