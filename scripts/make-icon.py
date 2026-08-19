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


def render_letter_a(size, color=(0, 0, 0), transparent=False, background=(255, 255, 255)):
    """Double-story lowercase a fallback if the macOS Arial Black renderer is unavailable."""
    pixels = bytearray(size * size * 4)
    fill = b"\x00\x00\x00\x00" if transparent else bytes([*background, 255])
    for i in range(0, len(pixels), 4):
        pixels[i : i + 4] = fill
    ink = bytes([*color, 255])
    stem_x0, stem_x1 = size * 0.60, size * 0.78
    stem_y0, stem_y1 = size * 0.18, size * 0.86
    for y in range(size):
        for x in range(size):
            px, py = (x + 0.5) / size, (y + 0.5) / size
            bowl = ((px - 0.42) / 0.30) ** 2 + ((py - 0.62) / 0.24) ** 2 <= 1
            bowl_hole = ((px - 0.40) / 0.13) ** 2 + ((py - 0.62) / 0.11) ** 2 <= 1
            upper = ((px - 0.46) / 0.24) ** 2 + ((py - 0.34) / 0.18) ** 2 <= 1
            upper_hole = ((px - 0.45) / 0.10) ** 2 + ((py - 0.34) / 0.08) ** 2 <= 1
            stem = stem_x0 <= x + 0.5 <= stem_x1 and stem_y0 <= y + 0.5 <= stem_y1
            if (bowl and not bowl_hole) or (upper and not upper_hole) or stem:
                idx = (y * size + x) * 4
                pixels[idx : idx + 4] = ink
    return pixels


def write_letter_a_png(path, size, color=(0, 0, 0), transparent=False, background=(255, 255, 255)):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    swift = os.path.join(ROOT, "scripts", "render-a-icon.swift")
    if os.path.isfile(swift):
        import subprocess
        import tempfile

        raw_fd, raw_path = tempfile.mkstemp(suffix=".rgba")
        os.close(raw_fd)
        command = ["swift", swift, str(size), raw_path]
        if transparent:
            command.append("--transparent")
        else:
            command.extend(["--background", f"{background[0]},{background[1]},{background[2]}"])
        if color != (0, 0, 0):
            command.extend(["--color", f"{color[0]},{color[1]},{color[2]}"])
        try:
            subprocess.run(command, check=True, capture_output=True)
            with open(raw_path, "rb") as handle:
                pixels = handle.read()
            if len(pixels) == size * size * 4:
                write_png(path, size, size, pixels)
                return
        except subprocess.CalledProcessError as error:
            detail = (error.stderr or error.stdout or b"").decode("utf-8", "replace").strip()
            if detail:
                print(detail, file=sys.stderr)
        except OSError:
            pass
        finally:
            try:
                os.unlink(raw_path)
            except OSError:
                pass
    write_png(
        path,
        size,
        size,
        render_letter_a(size, color=color, transparent=transparent, background=background),
    )


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

    paper = (246, 239, 228)
    ink = (17, 17, 17)
    master = os.path.join(ROOT, "website", "icon.png")
    write_letter_a_png(master, 1024, color=ink, background=paper)
    for dest in (
        os.path.join(ROOT, "website", "app", "icon.png"),
        os.path.join(ROOT, "build", "icon.png"),
    ):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copyfile(master, dest)

    for dest in (
        os.path.join(ROOT, "website", "apple-touch-icon.png"),
        os.path.join(ROOT, "website", "app", "apple-touch-icon.png"),
    ):
        write_letter_a_png(dest, 180, color=ink, background=paper)

    ico_images = []
    with tempfile.TemporaryDirectory() as tmp:
        for size in (16, 32, 48, 256):
            scaled = os.path.join(tmp, f"{size}.png")
            write_letter_a_png(scaled, size, color=ink, background=paper)
            with open(scaled, "rb") as handle:
                ico_images.append((size, size, handle.read()))
    write_ico(os.path.join(ROOT, "build", "icon.ico"), ico_images)

    icons = os.path.join(ROOT, "website", "app", "icons")
    write_letter_a_png(os.path.join(icons, "trayTemplate.png"), 22, transparent=True)
    write_letter_a_png(os.path.join(icons, "trayTemplate@2x.png"), 44, transparent=True)
    write_letter_a_png(os.path.join(icons, "tray.png"), 32, color=ink, transparent=True)

    print("Wrote app and tray icons")
    return 0


if __name__ == "__main__":
    sys.exit(main())
