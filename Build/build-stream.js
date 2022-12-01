const { fetchWithRetry } = require('../lib/fetch-retry');
const fs = require('fs');
const path = require('path');

(async () => {
  console.time('Total Time - build-apple-tpl');

  const res = (
    await (
      await fetchWithRetry(
        'https://raw.githubusercontent.com/geekdada/surge-list/master/surgio-snippet/apple.tpl'
      )
    ).text()
  )
    .split('\n')
    .map((line) => {
      if (line.startsWith('# http')) {
        return null;
      }

      return line;
    });
  // .filter((domain) => typeof domain === "string" && isDomainLoose(domain));

  // console.log(res);
  let ans = [];
  res.forEach((item) => {
    if (item !== null) {
      ans.push(item);
    }
  });
  console.log(ans.join('\n'));
  await Promise.all([
    fs.promises.writeFile(
      path.resolve(__dirname, '../../List/tpl/apple.tpl'),
      ans.map((domain) => domain).join('\n'),
      'utf-8'
    ),
  ]);

  console.timeEnd('Total Time - build-apple-tpl');
})();
