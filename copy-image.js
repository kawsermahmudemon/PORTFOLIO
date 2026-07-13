const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\mdemo\\.gemini\\antigravity-ide\\brain\\ef423e73-6640-4491-967c-40984a568557\\emon_profile_1783937589013.png';
const destDir = 'c:\\PORTFOLIO\\assets';
const dest = path.join(destDir, 'emon-profile.png');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('File copied successfully.');
