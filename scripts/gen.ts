import { access, constants, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import process from 'node:process';

const arg = process.argv[2];

if (!arg) {
  throw new Error('file name is required');
}

let { dir, name, ext } = parse(arg);
ext ||= '.md';

const file = join(process.cwd(), 'content', dir, `${name}${ext}`);

if (await isExist(file)) {
  throw new Error('file name is exist');
}
await writeFile(file, `---
title: "${name}"
draft: true
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
  const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
  return {
    toString() {
      return `${year}/${`${month + 1}`.padStart(2, '0')}/${`${day}`.padStart(2, '0')}`;
    },
  };
}
