const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\mdemo\\.gemini\\antigravity-ide\\brain\\671a4139-7b73-432c-97a4-e6cf71c889e9';
const destDir = 'c:\\PORTFOLIO\\assets\\projects';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
files.forEach(file => {
    if (file.startsWith('project_') && file.endsWith('.png')) {
        // e.g. project_1_blood_1783962145253.png -> project_1_blood.png
        const match = file.match(/(project_\d+_[a-z]+)/);
        if (match) {
            const newName = match[1] + '.png';
            fs.copyFileSync(path.join(srcDir, file), path.join(destDir, newName));
            console.log(`Copied ${file} to ${newName}`);
        }
    }
});
