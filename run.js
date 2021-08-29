#!/usr/bin/env node

/*
Run a source code on web page. The source code must define a main function with no parameters.
*/

const puppeteer = require('puppeteer');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const fs = require('fs');

let srcCode = '';
if (argv.srcPath) {
  srcCode = fs.readFileSync(argv.srcPath).toString();
} else if (argv.src) {
  srcCode = argv.src;
} else {
  console.error('missing source code. --url, --src or --srcPath');
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = (await browser.pages())[0];
  // const page = await browser.newPage();
  await page.goto(argv.url);
  await page.addScriptTag({content: srcCode});
  page.on('dialog', async dialog => {
    await dialog.dismiss();
  })
  res = await page.evaluate(() => main());
  console.log(res);
  await browser.close()
})()
