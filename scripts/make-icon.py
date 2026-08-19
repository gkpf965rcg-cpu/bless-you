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


def dist_to_segment(px, py, ax, ay, bx, by):
    abx = bx - ax
    aby = by - ay
    length = abx * abx + aby * aby
    if length == 0:
        return math.hypot(px - ax, py - ay)
    t = clamp(((px - ax) * abx + (py - ay) * aby) / length)
    return math.hypot(px - (ax + abx * t), py - (ay + aby * t))


def render_letter_a(size):
    """White square, black capital A. Used if the macOS Arial Black renderer is unavailable."""
    pixels = bytearray(size * size * 4)
    for i in range(0, len(pixels), 4):
        pixels[i : i + 4] = b"\xff\xff\xff\xff"
    left = (size * 0.16, size * 0.84)
    right = (size * 0.84, size * 0.84)
    peak = (size * 0.5, size * 0.16)
    bar_y = size * 0.58
    stroke = size * 0.11
    bar = size * 0.08
    for y in range(size):
        for x in range(size):
            px, py = x + 0.5, y + 0.5
            in_a = (
                dist_to_segment(px, py, peak[0], peak[1], left[0], left[1]) <= stroke
                or dist_to_segment(px, py, peak[0], peak[1], right[0], right[1]) <= stroke
                or (
                    dist_to_segment(px, py, size * 0.30, bar_y, size * 0.70, bar_y) <= bar
                    and py > size * 0.42
                )
            )
            if in_a:
                idx = (y * size + x) * 4
                pixels[idx : idx + 4] = b"\x00\x00\x00\xff"
    return pixels


def write_letter_a_png(path, size):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    swift = os.path.join(ROOT, "scripts", "render-a-icon.swift")
    if os.path.isfile(swift):
        import subprocess

        try:
            subprocess.run(["swift", swift, str(size), path], check=True, capture_output=True)
            return
        except (OSError, subprocess.CalledProcessError):
            pass
    write_png(path, size, size, render_letter_a(size))


def resize_png(src, dest, size):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    import shutil
    import subprocess

    try:
        subprocess.run(
            ["sips", "-z", str(size), str(size), src, "--out", dest],
            check=True,
            capture_output=True,
        )
        return
    except (OSError, subprocess.CalledProcessError):
        pass
    shutil.copyfile(src, dest)


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
    import shutil
    import tempfile

    master = os.path.join(ROOT, "website", "icon.png")
    write_letter_a_png(master, 512)
    for dest in (
        os.path.join(ROOT, "website", "app", "icon.png"),
        os.path.join(ROOT, "build", "icon.png"),
    ):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copyfile(master, dest)

    resize_png(master, os.path.join(ROOT, "website", "app", "apple-touch-icon.png"), 180)

    ico_images = []
    with tempfile.TemporaryDirectory() as tmp:
        for size in (16, 32, 48, 256):
            scaled = os.path.join(tmp, f"{size}.png")
            resize_png(master, scaled, size)
            with open(scaled, "rb") as handle:
                ico_images.append((size, size, handle.read()))
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
