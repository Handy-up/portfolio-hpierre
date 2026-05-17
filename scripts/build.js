const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const entries = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'config.js',
  'JsFiles',
  'style',
  'images',
  'documments',
  'css',
  'js',
];

execFileSync(process.execPath, [path.join(rootDir, 'scripts/generate-config.js')], {
  cwd: rootDir,
  stdio: 'inherit',
});

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const entry of entries) {
  const source = path.join(rootDir, entry);
  if (!fs.existsSync(source)) continue;

  fs.cpSync(source, path.join(distDir, entry), {
    recursive: true,
    force: true,
  });
}

console.log('Built static site into dist/');
