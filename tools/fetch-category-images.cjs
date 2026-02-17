const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'categories');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const categories = [
  { slug: 'electronics', url: 'https://source.unsplash.com/1200x800/?electronics,gadgets' },
  { slug: 'fashion', url: 'https://source.unsplash.com/1200x800/?fashion,clothing' },
  { slug: 'home-kitchen', url: 'https://source.unsplash.com/1200x800/?kitchen,home,interior' },
  { slug: 'books', url: 'https://source.unsplash.com/1200x800/?books,reading' },
  { slug: 'sports', url: 'https://source.unsplash.com/1200x800/?sports,fitness' },
  { slug: 'beauty', url: 'https://source.unsplash.com/1200x800/?beauty,cosmetics' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed to get ' + url + ' (status ' + res.statusCode + ')'));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  console.log('Downloading category images to', outDir);
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const dest = path.join(outDir, `${c.slug}.jpg`);
    try {
      console.log(' -', c.slug, '(Unsplash)');
      await download(c.url, dest);
      console.log('   saved to', dest);
    } catch (err) {
      console.error('   unsplash error:', err.message);
      const fallback = `https://picsum.photos/1200/800?random=${i + 1}`;
      try {
        console.log('   trying fallback (Picsum)');
        await download(fallback, dest);
        console.log('   saved fallback to', dest);
      } catch (err2) {
        console.error('   fallback error:', err2.message);
      }
    }
  }
  console.log('Done.');
})();
