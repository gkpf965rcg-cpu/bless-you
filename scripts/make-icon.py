#!/usr/bin/env python3
"""Generate app and tray icons without platform-specific tools."""

from __future__ import annotations

import math
import os
import struct
import sys
import zlib


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def lerp(a, b, t):
    return a + (b - a) * t


def mix(c1, c2, t):
    return tuple(int(lerp(a, b, t)) for a, b in zip(c1, c2))


def clamp(v, lo=0.0, hi=1.0):
    return max(lo, min(hi, v))


def rounded_rect_sdf(x, y, size, radius):
    qx = abs(x) - (size - radius)
    qy = abs(y) - (size - radius)
    outside = math.hypot(max(qx, 0.0), max(qy, 0.0))
    inside = min(max(qx, qy), 0.0)
    return outside + inside - radius


def png_bytes(width, height, pixels):
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        start = y * width * 4
        raw.extend(pixels[start : start + width * 4])

    def chunk(tag, data):
        crc = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")


def write_png(path, width, height, pixels):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as handle:
        handle.write(png_bytes(width, height, pixels))


def render_app_icon(size):
    cream = (244, 230, 208)
    cream_dark = (232, 208, 176)
    terracotta = (196, 92, 38)
    gold = (214, 154, 72)
    sparkle = (255, 244, 220)
    pixels = bytearray(size * size * 4)
    half = size / 2.0
    icon_radius = size * 0.223
    icon_extent = size * 0.42

    for y in range(size):
        for x in range(size):
            nx = x + 0.5 - half
            ny = y + 0.5 - half
            sdf = rounded_rect_sdf(nx, ny, icon_extent, icon_radius)
            edge = clamp(0.5 - sdf)
            if edge <= 0:
                continue

            t = clamp((ny + icon_extent) / (icon_extent * 2))
            color = mix(cream, cream_dark, t * 0.55)
            glow = math.exp(-((nx / (size * 0.22)) ** 2 + ((ny + size * 0.04) / (size * 0.22)) ** 2))
            color = mix(color, sparkle, glow * 0.18)

            for radius, width, strength in (
                (size * 0.11, size * 0.018, 0.95),
                (size * 0.17, size * 0.016, 0.72),
                (size * 0.23, size * 0.014, 0.5),
            ):
                dist = math.hypot(nx, ny + size * 0.02)
                ring = math.exp(-((dist - radius) / width) ** 2)
                angle = math.atan2(-(ny + size * 0.02), nx)
                fan = clamp((math.cos(angle - 0.55) + 0.35) / 1.35)
                color = mix(color, terracotta, ring * fan * strength)

            for sx, sy, r in (
                (size * 0.16, -size * 0.18, size * 0.028),
                (-size * 0.18, -size * 0.12, size * 0.016),
                (size * 0.08, size * 0.2, size * 0.013),
            ):
                d = math.hypot(nx - sx, ny - sy)
                star = math.exp(-(d / r) ** 2)
                color = mix(color, gold, star * 0.9)

            idx = (y * size + x) * 4
            pixels[idx : idx + 4] = bytes([*color, int(edge * 255)])
    return pixels


def downsample(pixels, src, dest):
    out = bytearray(dest * dest * 4)
    scale = src / dest
    for y in range(dest):
        for x in range(dest):
            x0 = int(x * scale)
            y0 = int(y * scale)
            x1 = max(x0 + 1, int((x + 1) * scale))
            y1 = max(y0 + 1, int((y + 1) * scale))
            r = g = b = a = count = 0
            for yy in range(y0, min(y1, src)):
                for xx in range(x0, min(x1, src)):
                    i = (yy * src + xx) * 4
                    r += pixels[i]
                    g += pixels[i + 1]
                    b += pixels[i + 2]
                    a += pixels[i + 3]
                    count += 1
            o = (y * dest + x) * 4
            if count:
                out[o : o + 4] = bytes([r // count, g // count, b // count, a // count])
    return out


def render_mic(size, color, filled_bg=None):
    pixels = bytearray(size * size * 4)
    if filled_bg:
        for i in range(0, len(pixels), 4):
            pixels[i : i + 4] = bytes([*filled_bg, 255])
    cx, cy = size / 2.0, size * 0.42
    cap_w, cap_h = size * 0.22, size * 0.28
    for y in range(size):
        for x in range(size):
            nx = x + 0.5
            ny = y + 0.5
            dx = (nx - cx) / cap_w
            dy = (ny - cy) / cap_h
            capsule = dx * dx + dy * dy <= 1.0 and ny < cy + cap_h
            stem = abs(nx - cx) < size * 0.05 and cy + cap_h * 0.6 < ny < size * 0.78
            base = abs(nx - cx) < size * 0.18 and abs(ny - size * 0.82) < size * 0.05
            bow = False
            if ny > cy:
                arc = math.hypot(nx - cx, ny - (cy + cap_h * 0.15))
                bow = size * 0.28 < arc < size * 0.36 and ny < size * 0.72
            if capsule or stem or base or bow:
                idx = (y * size + x) * 4
                pixels[idx : idx + 4] = bytes([*color, 255])
    return pixels


def write_ico(path, images):
    count = len(images)
    header = struct.pack("<HHH", 0, 1, count)
    entries = b""
    data = b""
    offset = 6 + 16 * count
    for width, height, png in images:
        entries += struct.pack(
            "<BBBBHHII",
            width if width < 256 else 0,
            height if height < 256 else 0,
            0,
            0,
            1,
            32,
            len(png),
            offset,
        )
        offset += len(png)
        data += png
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as handle:
        handle.write(header + entries + data)


def main():
    master = 512
    pixels = render_app_icon(master)
    write_png(os.path.join(ROOT, "website", "icon.png"), master, master, pixels)
    write_png(os.path.join(ROOT, "website", "app", "icon.png"), master, master, pixels)
    write_png(os.path.join(ROOT, "build", "icon.png"), master, master, pixels)

    touch = downsample(pixels, master, 180)
    write_png(os.path.join(ROOT, "website", "app", "apple-touch-icon.png"), 180, 180, touch)

    ico_images = []
    for size in (16, 32, 48, 256):
        scaled = downsample(pixels, master, size) if size != master else pixels
        ico_images.append((size, size, png_bytes(size, size, scaled)))
    write_ico(os.path.join(ROOT, "build", "icon.ico"), ico_images)

    mic_template = render_mic(32, (0, 0, 0))
    mic_color = render_mic(32, (196, 92, 38))
    write_png(os.path.join(ROOT, "website", "app", "icons", "trayTemplate.png"), 32, 32, mic_template)
    write_png(os.path.join(ROOT, "website", "app", "icons", "trayTemplate@2x.png"), 32, 32, mic_template)
    write_png(os.path.join(ROOT, "website", "app", "icons", "tray.png"), 32, 32, mic_color)

    print("Wrote app and tray icons")
    return 0


if __name__ == "__main__":
    sys.exit(main())
