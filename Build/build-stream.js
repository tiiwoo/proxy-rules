const { fetchWithRetry } = require('./lib/fetch-retry');
const fs = require('fs');
const path = require('path');

const { compareAndWriteFile } = require('./lib/string-array-compare');
const { withBannerArray } = require('./lib/with-banner');

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
    compareAndWriteFile(
      withBannerArray(
        'Surge Rules - Stream',
        [
          'License: AGPL 3.0',
          'Homepage: https://ruleset.looplab.moe',
          'GitHub: https://github.com/Tiiwoo/Surge',
          '',
          'This file contains Netflix and Disney rules.',
          '',
          'Data from:',
          ' - https://www.github.com/blackmatrix7/ios_rule_script',
        ],
        new Date(),
        nonip.map((domain) => `DOMAIN-SUFFIX,${domain}`)
      ),
      path.resolve(__dirname, '../List/non_ip/stream.conf')
    ),
    compareAndWriteFile(
      withBannerArray(
        'Surge Rules - Stream',
        [
          'License: AGPL 3.0',
          'Homepage: https://ruleset.looplab.moe',
          'GitHub: https://github.com/Tiiwoo/Surge',
          '',
          'This file contains Netflix and Disney rules.',
          '',
          'Data from:',
          ' - https://www.github.com/blackmatrix7/ios_rule_script',
        ],
        new Date(),
        ip.map((i) => `.${i}`)
      ),
      path.resolve(__dirname, '../List/ip/stream.conf')
    ),
  ]);
  // await Promise.all([
  //   fs.promises.writeFile(
  //     path.resolve(__dirname, '../List/non_ip/stream.conf'),
  //     nonip.map((domain) => domain).join('\n'),
  //     'utf-8'
  //   ),
  //   fs.promises.writeFile(
  //     path.resolve(__dirname, '../List/ip/stream.conf'),
  //     ip.map((ip) => ip).join('\n'),
  //     'utf-8'
  //   ),
  // ]);

  console.timeEnd('Total Time - build-stream-conf');
})();
