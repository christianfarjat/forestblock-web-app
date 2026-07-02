#!/usr/bin/env python3
"""
Diagrama de arquitectura del stack ENTE, renderizado con Pillow (PIL) a PNG.

Se usa desde build_docs.py para embeber la imagen en el .docx de arquitectura,
y puede correrse solo para inspeccionar el resultado:

    python3 diagram.py            # -> builders/output/arquitectura_diagrama.png
"""

import os

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "output")

FOREST = (31, 78, 61)
LIGHT = (231, 240, 235)
GREY = (112, 112, 112)
WHITE = (255, 255, 255)
INK = (35, 35, 35)

W, H = 1160, 700

_FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/Library/Fonts/Arial.ttf",
]
_FONT_BOLD_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
]


def _font(size, bold=False):
    for path in (_FONT_BOLD_CANDIDATES if bold else _FONT_CANDIDATES):
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                pass
    try:
        return ImageFont.load_default(size=size)
    except TypeError:  # Pillow < 10.1
        return ImageFont.load_default()


def _text_w(draw, text, font):
    return draw.textbbox((0, 0), text, font=font)[2]


def _wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if _text_w(draw, trial, font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def _box(draw, xy, title, subtitle="", fill=WHITE, border=FOREST, title_color=FOREST):
    x, y, w, h = xy
    draw.rounded_rectangle([x, y, x + w, y + h], radius=10, fill=fill, outline=border, width=2)
    ft, fs = _font(16, bold=True), _font(12)
    draw.text((x + w / 2, y + 14), title, font=ft, fill=title_color, anchor="mm")
    if subtitle:
        yy = y + 34
        for line in _wrap(draw, subtitle, fs, w - 20):
            draw.text((x + w / 2, yy), line, font=fs, fill=GREY, anchor="mm")
            yy += 16
    return xy


def _arrow(draw, p1, p2, color=FOREST, width=2, label=""):
    draw.line([p1, p2], fill=color, width=width)
    import math

    ang = math.atan2(p2[1] - p1[1], p2[0] - p1[0])
    size = 9
    for da in (2.6, -2.6):
        draw.line([p2, (p2[0] - size * math.cos(ang + da), p2[1] - size * math.sin(ang + da))], fill=color, width=width)
    if label:
        mx, my = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
        draw.text((mx, my - 9), label, font=_font(11), fill=GREY, anchor="mm")


def render_architecture(out):
    """Renderiza el diagrama y lo guarda en `out` (ruta o file-like)."""
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)
    d.text((W / 2, 30), "ENTE — Arquitectura del stack documental", font=_font(22, bold=True), fill=FOREST, anchor="mm")

    # Fila superior: pipeline config -> builders -> backend -> sheet.
    y0 = 80
    cfg = _box(d, (40, y0, 230, 74), "config", "dataroom.config.json · IDs, mapeo, roles", fill=LIGHT)
    bld = _box(d, (320, y0, 210, 74), "builders/", "backend · checklist · docs · validate")
    bkd = _box(d, (580, y0, 190, 74), "Backend .xlsx", "7 pestañas")
    sht = _box(d, (820, y0, 300, 74), "Google Sheet (SHEET_ID)", "convertido en Fase 3")

    _arrow(d, (270, y0 + 37), (320, y0 + 37))
    _arrow(d, (530, y0 + 37), (580, y0 + 37))
    _arrow(d, (770, y0 + 37), (820, y0 + 37), label="Fase 3")

    # Fila media: AppSheet (bot) y Apps Script (webhook), ambos sobre el Sheet.
    y1 = 230
    aps = _box(d, (580, y1, 230, 84), "AppSheet app + Bot", "estados de Documents; dispara webhook", fill=LIGHT)
    scr = _box(d, (860, y1, 260, 84), "Apps Script — Dataroom.gs", "web app: doPost / doGet")

    _arrow(d, (970, y0 + 74), (970, y1), label="lee/escribe")   # Sheet -> Script
    _arrow(d, (695, y0 + 74), (695, y1))                         # Sheet -> AppSheet
    _arrow(d, (810, y1 + 42), (860, y1 + 42), label="POST {token}")  # Bot -> Script

    # Acciones del webhook.
    y2 = 380
    a1 = _box(d, (580, y2, 165, 84), "snapshot", "copia inmutable")
    a2 = _box(d, (765, y2, 165, 84), "share", "por rol · Access_Matrix")
    a3 = _box(d, (950, y2, 170, 84), "register", "upsert Documents")
    for cx in (662, 847, 1035):
        _arrow(d, (990, y1 + 84), (cx, y2))

    # Drive: dataroom.
    y3 = 520
    d.rounded_rectangle([320, y3, 1120, y3 + 130], radius=12, fill=(247, 250, 248), outline=FOREST, width=2)
    d.text((340, y3 + 16), "Google Drive — ENTE Dataroom Verra (MJM-FB)", font=_font(14, bold=True), fill=FOREST, anchor="lm")
    _box(d, (340, y3 + 34, 230, 74), "01_PDD", "10 documentos", fill=WHITE)
    _box(d, (590, y3 + 34, 250, 74), "00_Base_Habilitantes", "7 documentos", fill=WHITE)
    _box(d, (860, y3 + 34, 240, 74), "C_Snapshots_VVB", "copias inmutables", fill=WHITE)

    _arrow(d, (662, y2 + 84), (980, y3))    # snapshot -> snapshots folder
    _arrow(d, (847, y2 + 84), (700, y3))    # share -> base habilitantes

    if hasattr(out, "write"):
        img.save(out, format="PNG")
    else:
        os.makedirs(os.path.dirname(out), exist_ok=True)
        img.save(out)
    return out


if __name__ == "__main__":
    path = os.path.join(OUT_DIR, "arquitectura_diagrama.png")
    render_architecture(path)
    print(f"OK  {path}")
