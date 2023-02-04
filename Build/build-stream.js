const { fetchWithRetry } = require('./lib/fetch-retry');
const fs = require('fs');
const path = require('path');

const URLS = [
  'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Netflix/Netflix.list',
  'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Disney/Disney.list',
];

(async () => {
  console.time('Total Time - build-stream-conf');

  const nonip = [];
  const ip = [];

  (await (await fetchWithRetry(URLS[0])).text()).split('\n').map((line) => {
    if (line.startsWith('DOMAIN')) {
      nonip.push(line);
    } else if (line.startsWith('IP')) {
      ip.push(line);
    }
  });
  (await (await fetchWithRetry(URLS[1])).text()).split('\n').map((line) => {
    if (line.startsWith('DOMAIN')) {
      nonip.push(line);
    } else if (line.startsWith('IP')) {
      ip.push(line);
    }
  });

  // console.log(nonip);
  // console.log('-----------------------');
  // console.log(ip);

  await Promise.all([
    fs.promises.writeFile(
      path.resolve(__dirname, '../List/non_ip/stream.conf'),
      nonip.map((domain) => domain).join('\n'),
      'utf-8'
    ),
    fs.promises.writeFile(
      path.resolve(__dirname, '../List/ip/stream.conf'),
      ip.map((ip) => ip).join('\n'),
      'utf-8'
    ),
  ]);

  console.timeEnd('Total Time - build-stream-conf');
})();
