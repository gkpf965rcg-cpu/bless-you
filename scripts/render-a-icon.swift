import AppKit

let args = CommandLine.arguments
guard args.count >= 3, let size = Int(args[1]) else {
  fputs("usage: render-a-icon.swift SIZE OUTPUT.png\n", stderr)
  exit(1)
}
let output = args[2]
let dimension = CGFloat(size)
let image = NSImage(size: NSSize(width: dimension, height: dimension))
image.lockFocus()
NSColor.white.setFill()
NSRect(x: 0, y: 0, width: dimension, height: dimension).fill()
let fontSize = dimension * 0.78
guard let font = NSFont(name: "Arial-Black", size: fontSize)
  ?? NSFont(name: "Arial Black", size: fontSize)
  ?? NSFont.boldSystemFont(ofSize: fontSize) else {
  fputs("could not load a heavy sans-serif font\n", stderr)
  exit(1)
}
let attributes: [NSAttributedString.Key: Any] = [
  .font: font,
  .foregroundColor: NSColor.black
]
let text = "A" as NSString
let textSize = text.size(withAttributes: attributes)
let origin = NSPoint(
  x: (dimension - textSize.width) / 2,
  y: (dimension - textSize.height) / 2 - dimension * 0.04
)
text.draw(at: origin, withAttributes: attributes)
image.unlockFocus()
guard let tiff = image.tiffRepresentation,
  let bitmap = NSBitmapImageRep(data: tiff),
  let png = bitmap.representation(using: .png, properties: [:]) else {
  fputs("could not encode PNG\n", stderr)
  exit(1)
}
try png.write(to: URL(fileURLWithPath: output))
