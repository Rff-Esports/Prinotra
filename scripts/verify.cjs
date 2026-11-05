const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

let count = 0;
function checkDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (item.endsWith('.js')) {
      execFileSync(process.execPath, ['--check', full], { stdio: 'pipe' });
      count++;
    }
  }
}

try {
  checkDir(path.join(__dirname, '..', 'src'));
  console.log(`SUCCESS: Checked ${count} JavaScript files. All syntax is 100% valid!`);
} catch (err) {
  console.error('Syntax error detected:', err.message);
  process.exit(1);
}
