---
title: "node调用系统命令"
tags: ['node']
---

```
const exec = require('util').promisify(require('child_process').exec);

async function run(command) {
    const {
        stdout,
        stderr
    } = await exec(command);

    if (stderr) {
        return {
            code:1,
            data:stderr
        };
    }
    if (stdout) {
        return {
            code:0,
            data:stdout
        };
    }
}

(async ()=>{
    let result = await run('cd ../ && ls');
    let result2 = await run('wc -l index.js');
    console.log(result)
    console.log(result2)
})()
```