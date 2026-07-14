const fs = require('fs');
const path = require('path');

const src = path.join('C:', 'Users', 'mdemo', '.gemini', 'antigravity-ide', 'brain', '00d1d7d7-1f51-48c1-a0fa-2e536da17392', 'media__1784012215404.jpg');
const destDir = path.join('c:', 'PORTFOLIO', 'images');
const dest = path.join(destDir, 'emon-profile.jpg');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Real photo copied successfully to', dest);
