import {
  downloadPreviousBuild,
  downloadPublicSuffixList,
} from './download-previous-build';
import { buildCommon } from './build-common';
import { buildAppleCdn } from './build-apple-cdn';
import { buildCdnConf } from './build-cdn-conf';
import { buildTelegramCIDR } from './build-telegram-cidr';
import { buildChnCidr } from './build-chn-cidr';
import { validate } from './validate-domainset';

import { buildPublic } from './build-public';

(async () => {
  console.log('Bun version:', Bun.version);

  try {
    // TODO: restore this once Bun has fixed their worker
    // const buildInternalReverseChnCIDRWorker = new Worker(new URL('./workers/build-internal-reverse-chn-cidr-worker.ts', import.meta.url));

    const downloadPreviousBuildPromise = downloadPreviousBuild();
    const downloadPublicSuffixListPromise = downloadPublicSuffixList();
    const buildCommonPromise = downloadPreviousBuildPromise.then(() =>
      buildCommon()
    );
    const buildAppleCdnPromise = downloadPreviousBuildPromise.then(() =>
      buildAppleCdn()
    );
    const buildCdnConfPromise = Promise.all([
      downloadPreviousBuildPromise,
      downloadPublicSuffixListPromise,
    ]).then(() => buildCdnConf());
    const buildTelegramCIDRPromise = downloadPreviousBuildPromise.then(() =>
      buildTelegramCIDR()
    );
    const buildChnCidrPromise = downloadPreviousBuildPromise.then(() =>
      buildChnCidr()
    );

    const stats = await Promise.all([
      downloadPreviousBuildPromise,
      downloadPublicSuffixListPromise,
      buildCommonPromise,
      buildAppleCdnPromise,
      buildCdnConfPromise,
      buildTelegramCIDRPromise,
      buildChnCidrPromise,
    ]);

    await Promise.all([buildPublic(), validate()]);

    printStats(stats);
  } catch (e) {
    console.trace(e);
    console.error('Something went wrong!');
    process.exit(1);
  }
})();

function printStats(
  stats: Array<{ start: number; end: number; taskName: string }>
): void {
  stats.sort((a, b) => a.start - b.start);

  const longestTaskName = Math.max(...stats.map((i) => i.taskName.length));
  const realStart = Math.min(...stats.map((i) => i.start));
  const realEnd = Math.max(...stats.map((i) => i.end));

  const statsStep = ((realEnd - realStart) / 160) | 0;

  stats.forEach((stat) => {
    console.log(
      `[${stat.taskName}]${' '.repeat(longestTaskName - stat.taskName.length)}`,
      ' '.repeat(((stat.start - realStart) / statsStep) | 0),
      '='.repeat(Math.max(((stat.end - stat.start) / statsStep) | 0, 1))
    );
  });
}
