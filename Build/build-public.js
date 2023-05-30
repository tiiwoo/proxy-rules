const listDir = require('@sukka/listdir');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

const rootPath = path.resolve(__dirname, '../');
const publicPath = path.resolve(__dirname, '../public');

const folderAndFilesToBeDeployed = [
  'Assets',
  'List',
  'Modules',
  'Script',
  'LICENSE',
  'README.md',
];

(async () => {
  await fse.ensureDir(publicPath);
  await Promise.all(
    folderAndFilesToBeDeployed.map((dir) =>
      fse.copy(path.resolve(rootPath, dir), path.resolve(publicPath, dir))
    )
  );

  const list = await listDir(publicPath, {
    ignoreHidden: true,
    ignorePattern:
      /node_modules|Build|.DS_Store|\.(json|html|md|js)|LICENSE|Modules/,
  });

  const html = template(list);

  await fs.promises.writeFile(
    path.join(publicPath, 'index.html'),
    html,
    'utf-8'
  );
})();

/**
 * @param {string[]} urlList
 * @returns {string}
 */
function template(urlList) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Rulesets For Surge</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <link href="https://cdn.skk.moe/favicon.ico" rel="icon" type="image/ico">
    <link href="https://cdn.skk.moe/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180">
    <link href="https://cdn.skk.moe/favicon/android-chrome-192x192.png" rel="icon" type="image/png" sizes="192x192">
    <link href="https://cdn.skk.moe/favicon/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32">
    <link href="https://cdn.skk.moe/favicon/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16">
    <meta name="description" content="Tiiwoo 自用的 Surge 规则组">
    <meta property="og:title" content="Surge Ruleset">
    <meta property="og:type" content="Website">
    <meta property="og:url" content="https://ruleset.tiiwoo.moe/">
    <meta property="og:image" content="https://cdn.skk.moe/favicon/android-chrome-192x192.png">
    <meta property="og:description" content="Tiiwoo 自用的 Surge 规则组">
    <meta name="twitter:card" content="summary">
    <link rel="canonical" href="https://ruleset.tiiwoo.moe/">
    <link rel="stylesheet" href="https://cdn.staticfile.org/picocss/1.5.0/pico.slim.min.css">
  </head>
  <body>
    <main class="container">
      <h1>Rulesets For Surge</h1>
      <p>Made by <a href="https://tiiwoo.moe">Tiiwoo</a></p>
      <p>Last Updated: ${new Date().toISOString()}</p>
      <hr>
      <br>
      <ul>
        ${urlList
          .sort()
          .map((url) => `<li><a href="${url}" target="_blank">${url}</a></li>`)
          .join('')}
      </ul>
    </main>
  </body>
  </html>
  `;
}
