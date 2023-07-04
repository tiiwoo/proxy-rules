const { promises: fsPromises } = require('fs');

async function compareAndWriteFile(linesA, filePath) {
  const linesB = (
    await fsPromises.readFile(filePath, { encoding: 'utf-8' })
  ).split('\n');

  if (!stringArrayCompare(linesA, linesB)) {
    await fsPromises.writeFile(filePath, linesA.join('\n'), {
      encoding: 'utf-8',
    });
  } else {
    console.log(`Same Content, bail out writing: ${filePath}`);
  }
}

function stringArrayCompare(linesA, linesB) {
  if (linesA.length !== linesB.length) return false;

  for (let i = 0; i < linesA.length; i++) {
    const lineA = linesA[i];
    const lineB = linesB[i];
    if (lineA.startsWith('##') && lineB.startsWith('##')) {
      continue;
    }
    if (lineA !== lineB) {
      return false;
    }
  }

  return true;
}

module.exports.stringArrayCompare = stringArrayCompare;
module.exports.compareAndWriteFile = compareAndWriteFile;
