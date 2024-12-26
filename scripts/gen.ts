import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const name = process.argv[2];

if (!name) {
  throw new Error('file name is required');
}

writeFileSync(join(process.cwd(), 'content', `${name}.md`), `---
title: "${name}"
tags: []
date: "${new Date().toLocaleDateString()}"
---

`);
