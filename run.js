#!/usr/bin/env node

/*
Run a source code on web page. The source code must define a main function with no parameters.
*/

const puppeteer = require('puppeteer');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs');
const argv = yargs(hideBin(process.argv))
  .array('srcPath')
  .required('url')
  .argv

let srcCodes = [];
argv.srcPath.forEach(path => {
  srcCodes.push(fs.readFileSync(path).toString());
})
if (argv.src) {
  srcCodes.push(argv.src);
}
if (srcCodes.length === 0) {
  console.error('missing source code');
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = (await browser.pages())[0];
  // const page = await browser.newPage();
  await page.goto(argv.url);
  for (const srcCode of srcCodes) {
    await page.addScriptTag({content: srcCode});
  }
  page.on('dialog', async dialog => {
    await dialog.dismiss();
  })
  res = await page.evaluate(() => main());
  console.log(res);
  await browser.close()
})()
