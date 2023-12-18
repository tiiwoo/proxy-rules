const { fetchWithRetry } = require('./lib/fetch-retry');
const fs = require('fs');
const path = require('path');

const { compareAndWriteFile } = require('./lib/string-array-compare');
const { withBannerArray } = require('./lib/with-banner');

const URLS = [
  'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Netflix/Netflix.list',
  'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Disney/Disney.list',
  'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/PrimeVideo/PrimeVideo.list',
];

(async () => {
  console.time('Total Time - build-stream-conf');

  const domainset = [];
  const not_domainset = [];
  const regex = /^(DOMAIN(-SUFFIX)?),/;

  // console.log('start');
  (await (await fetchWithRetry(URLS[0])).text()).split('\n').map((line) => {
    if (regex.test(line)) {
      line = line.replace(regex, (match, p1, p2) => {
        if (p2 === '-SUFFIX') {
          return '.'; // 如果匹配到 "DOMAIN-SUFFIX"，替换为 "."
        } else {
          return ''; // 如果只匹配到 "DOMAIN"，替换为空字符串
        }
      });
      domainset.push(line);
    } else if (!line.startsWith('# ')) {
      not_domainset.push(line);
    }
  });
  (await (await fetchWithRetry(URLS[1])).text()).split('\n').map((line) => {
    if (regex.test(line)) {
      line = line.replace(regex, (match, p1, p2) => {
        if (p2 === '-SUFFIX') {
          return '.'; // 如果匹配到 "DOMAIN-SUFFIX"，替换为 "."
        } else {
          return ''; // 如果只匹配到 "DOMAIN"，替换为空字符串
        }
      });
      domainset.push(line);
    } else if (!line.startsWith('# ') && !line.startsWith('\n')) {
      // console.log(line);
      not_domainset.push(line);
    }
  });
  (await (await fetchWithRetry(URLS[2])).text()).split('\n').map((line) => {
    if (regex.test(line)) {
      line = line.replace(regex, (match, p1, p2) => {
        if (p2 === '-SUFFIX') {
          return '.'; // 如果匹配到 "DOMAIN-SUFFIX"，替换为 "."
        } else {
          return ''; // 如果只匹配到 "DOMAIN"，替换为空字符串
        }
      });
      domainset.push(line);
    } else if (!line.startsWith('# ') && !line.startsWith('\n')) {
      // console.log(line);
      not_domainset.push(line);
    }
  });
  // console.log('end');

  // console.log(nonip);
  // console.log('-----------------------');
  // console.log(ip);
  await Promise.all([
    compareAndWriteFile(
      withBannerArray(
        'Surge Rules - Stream',
        [
          'License: AGPL 3.0',
          'Homepage: https://ruleset.tiiwoo.moe',
          'GitHub: https://github.com/Tiiwoo/Surge',
          '',
          'This file contains Netflix | Disney | PrimeVideo rules.',
          '',
          'Data from:',
          ' - https://www.github.com/blackmatrix7/ios_rule_script',
        ],
        new Date(),
        domainset
          .map((domain) => `${domain}`)
          .filter((line) => line.trim() !== '')
      ),
      path.resolve(__dirname, '../List/domainset/stream.conf')
    ),
    compareAndWriteFile(
      withBannerArray(
        'Surge Rules - Stream',
        [
          'License: AGPL 3.0',
          'Homepage: https://ruleset.tiiwoo.moe',
          'GitHub: https://github.com/Tiiwoo/Surge',
          '',
          'This file contains Netflix | Disney | PrimeVideo rules.',
          '',
          'Data from:',
          ' - https://www.github.com/blackmatrix7/ios_rule_script',
        ],
        new Date(),
        not_domainset.map((i) => `${i}`).filter((line) => line.trim() !== '')
      ),
      path.resolve(__dirname, '../List/domainset/stream_fix.conf')
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
