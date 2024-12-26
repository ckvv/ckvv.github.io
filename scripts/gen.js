import { access, constants, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const name = process.argv[2];

if (!name) {
  throw new Error('file name is required');
}

const file = join(process.cwd(), 'content', `${name}.md`);

if (await isExist(file)) {
  throw new Error('file name is exist');
}
await writeFile(file, `---
title: "${name}"
tags: []
date: "${formatDate(new Date())}"
---

`);

async function isExist(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

function formatDate(date) {
  const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDay()];
  return {
    toString() {
      return `${year}/${`${month + 1}`.padStart(2, '0')}/${`${day + 1}`.padStart(2, '0')}`;
    },
  };
}
