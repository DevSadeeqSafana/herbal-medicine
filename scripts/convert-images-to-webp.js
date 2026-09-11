const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imageDir = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(imageDir)) {
  console.log('Image directory not found:', imageDir);
  process.exit(1);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

(async () => {
  const files = walk(imageDir);
  const conversions = [];

  for (const src of files) {
    if (!/\.(jpg|jpeg)$/i.test(src)) continue;

    const dst = src.replace(/\.(jpg|jpeg)$/i, '.webp');
    conversions.push(
      sharp(src)
        .webp({ quality: 88 })
        .toFile(dst)
        .then(() => {
          console.log(`converted ${path.basename(src)} -> ${path.basename(dst)}`);
          if (fs.existsSync(src)) {
            fs.unlinkSync(src);
            console.log(`removed ${path.basename(src)}`);
          }
        })
        .catch((err) => {
          console.error(`failed ${path.basename(src)}`, err);
        })
    );
  }

  await Promise.all(conversions);
  console.log(`Finished converting ${conversions.length} image file(s) to WebP.`);
})();
