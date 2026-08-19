import CoreGraphics
import CoreText
import Foundation

var positional: [String] = []
var transparent = false
var red = 0.0
var green = 0.0
var blue = 0.0
var background: (Double, Double, Double)? = (1, 1, 1)

var index = 1
let args = CommandLine.arguments
while index < args.count {
  let arg = args[index]
  if arg == "--transparent" {
    transparent = true
    background = nil
  } else if arg == "--color" || arg == "--background" {
    index += 1
    guard index < args.count else {
      fputs("missing \(arg) value\n", stderr)
      exit(1)
    }
    let parts = args[index]
      .split(separator: ",")
      .compactMap { Double($0.trimmingCharacters(in: .whitespaces)) }
    guard parts.count == 3 else {
      fputs("\(arg) needs R,G,B in 0-255\n", stderr)
      exit(1)
    }
    let rgb = (parts[0] / 255, parts[1] / 255, parts[2] / 255)
    if arg == "--color" {
      red = rgb.0
      green = rgb.1
      blue = rgb.2
    } else {
      background = rgb
    }
  } else if arg.hasPrefix("-") {
    fputs("unknown flag \(arg)\n", stderr)
    exit(1)
  } else {
    positional.append(arg)
  }
  index += 1
}

guard positional.count >= 2, let size = Int(positional[0]), size > 0 else {
  fputs("usage: render-a-icon.swift SIZE OUTPUT.rgba [--transparent] [--color R,G,B] [--background R,G,B]\n", stderr)
  exit(1)
}

func fontNamed(_ name: String, size: CGFloat) -> CTFont? {
  let font = CTFontCreateWithName(name as CFString, size, nil)
  let postscript = (CTFontCopyPostScriptName(font) as String).lowercased()
  let family = (CTFontCopyFamilyName(font) as String).lowercased()
  let requested = name.lowercased().replacingOccurrences(of: " ", with: "-")
  if postscript == requested || family == "arial black" || (family == "arial" && postscript.contains("black")) {
    return font
  }
  return nil
}

let output = positional[1]
let dimension = CGFloat(size)
let bytesPerRow = size * 4
let byteCount = size * bytesPerRow
let ptr = UnsafeMutableRawPointer.allocate(byteCount: byteCount, alignment: 16)
ptr.initializeMemory(as: UInt8.self, repeating: 0, count: byteCount)
defer { ptr.deallocate() }

guard let colorSpace = CGColorSpace(name: CGColorSpace.sRGB),
  let ctx = CGContext(
    data: ptr,
    width: size,
    height: size,
    bitsPerComponent: 8,
    bytesPerRow: bytesPerRow,
    space: colorSpace,
    bitmapInfo: CGBitmapInfo.byteOrder32Big.rawValue | CGImageAlphaInfo.premultipliedLast.rawValue
  ) else {
  fputs("could not create bitmap context\n", stderr)
  exit(1)
}

ctx.setAllowsAntialiasing(true)
ctx.setShouldAntialias(true)
ctx.setAllowsFontSmoothing(false)
ctx.setShouldSmoothFonts(false)
ctx.interpolationQuality = .high

let bounds = CGRect(x: 0, y: 0, width: dimension, height: dimension)
if let background {
  ctx.setFillColor(CGColor(srgbRed: background.0, green: background.1, blue: background.2, alpha: 1))
  ctx.fill(bounds)
} else {
  ctx.clear(bounds)
}

guard let font = fontNamed("Arial-Black", size: dimension) ?? fontNamed("Arial Black", size: dimension) else {
  fputs("could not load Arial Black\n", stderr)
  exit(1)
}

var unichars: [UniChar] = [0x61]
var glyphs: [CGGlyph] = [0]
guard CTFontGetGlyphsForCharacters(font, &unichars, &glyphs, 1),
  let path = CTFontCreatePathForGlyph(font, glyphs[0], nil) else {
  fputs("could not outline Arial Black a\n", stderr)
  exit(1)
}

let box = path.boundingBoxOfPath
let padding = dimension * 0.10
let available = max(dimension - padding * 2, 1)
let scale = min(available / max(box.width, 1), available / max(box.height, 1))
ctx.translateBy(x: dimension / 2, y: dimension / 2)
ctx.scaleBy(x: scale, y: scale)
ctx.translateBy(x: -box.midX, y: -box.midY)
ctx.addPath(path)
ctx.setFillColor(CGColor(srgbRed: red, green: green, blue: blue, alpha: 1))
ctx.fillPath()
ctx.flush()

let rgba = Data(bytes: ptr, count: byteCount)
try rgba.write(to: URL(fileURLWithPath: output))
