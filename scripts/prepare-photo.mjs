// Turns a photo straight off a phone into the files the site uses.
// Usage: node scripts/prepare-photo.mjs <source.jpg>
//
// Always run photos through this instead of copying them in: the repo is
// public, and phone photos carry embedded location and camera data. sharp
// drops that metadata on output, and the checks below fail if any survives.

import { statSync } from 'node:fs'
import sharp from 'sharp'

const MAX_BYTES = 400 * 1024

const source = process.argv[2]
if (!source) {
  console.error('Usage: node scripts/prepare-photo.mjs <source.jpg>')
  process.exit(1)
}

const outputs = [
  { file: 'src/assets/couple-1600.jpg', resize: { width: 1600 }, limit: MAX_BYTES },
  { file: 'src/assets/couple-800.jpg', resize: { width: 800 }, limit: MAX_BYTES },
  // Link-preview image for texts and social apps.
  { file: 'public/og.jpg', resize: { width: 1200, height: 630, fit: 'cover', position: 'attention' } },
]

let failed = false
for (const { file, resize, limit } of outputs) {
  // rotate() with no arguments bakes in the phone's orientation flag.
  await sharp(source).rotate().resize(resize).jpeg({ quality: 78, mozjpeg: true }).toFile(file)

  const { width, height, exif } = await sharp(file).metadata()
  const bytes = statSync(file).size
  console.log(`${file}  ${width}x${height}  ${Math.round(bytes / 1024)} KB`)

  if (exif) {
    console.error(`  ${file} still has embedded metadata`)
    failed = true
  }
  if (limit && bytes >= limit) {
    console.error(`  ${file} is over ${limit / 1024} KB`)
    failed = true
  }
}

process.exit(failed ? 1 : 0)
