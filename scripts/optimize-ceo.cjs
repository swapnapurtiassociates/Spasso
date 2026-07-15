const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const root = path.resolve('.');
const src = path.join(root, 'attached_assets', 'ceo.png');
const out = path.join(root, 'attached_assets', 'ceo.jpg');

async function run() {
  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(1);
  }

  const image = await Jimp.read(src);
  image.cover(800, 1000, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
  await image.quality(75).writeAsync(out);

  console.log('Optimized image saved to', out);
}

run().catch((err) => { console.error(String(err)); process.exit(1); });
