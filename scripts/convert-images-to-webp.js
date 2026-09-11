const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imageDir = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(imageDir)) {
  console.log('Image directory not found:', imageDir);
  process.exit(1);
}

for (const file of fs.readdirSync(imageDir)) {
  if (/\.jpg$/i.test(file)) {
    const src = path.join(imageDir, file);
    const dst = path.join(imageDir, file.replace(/\.jpg$/i, '.webp'));
    sharp(src)
      .webp({ quality: 88 })
      .toFile(dst)
      .then(() => {
        console.log(`converted ${file} -> ${path.basename(dst)}`);
      })
      .catch((err) => {
        console.error(`failed ${file}`, err);
      });
  }
}
