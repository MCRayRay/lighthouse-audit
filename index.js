#!/usr/bin/env node

const chromeLauncher = require('chrome-launcher')
const got = require('got')
const lighthouse = require('lighthouse')
const puppeteer = require('puppeteer')

class Auditor {
  constructor(args) {
    this.authHandler = args.authHandler || (() => {})
    this.chromeFlags = args.chromeFlags || ['--headless']
    this.postAuthURLs = args.postAuthURLs || []
    this.preAuthURLs = args.preAuthURLs || []
  }

  async run() {
    const chromeOpts = {
      chromeFlags: this.chromeFlags,
      logLevel: 'error'
    }

    const chrome = this.chrome = await chromeLauncher.launch(chromeOpts)

    const resp = await got(`http://localhost:${chrome.port}/json/version`)
    const { webSocketDebuggerUrl } = JSON.parse(resp.body)

    const browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl
    })

    await this.auditURLs(this.preAuthURLs)

    await this.authHandler(browser)

    await this.auditURLs(this.postAuthURLs)

    await browser.disconnect()
    await chrome.kill()
  }

  async auditPage(url) {
    const { lhr } = await lighthouse(
      url,
      { output: 'json', port: this.chrome.port },
      {
        extends: 'lighthouse:default',
        settings: {
          onlyCategories: ['accessibility'],
        }
      }
    )

    return Object.values(lhr.audits).filter(
      audit =>
        audit.scoreDisplayMode !== 'notApplicable' &&
        audit.scoreDisplayMode !== 'informative' &&
        audit.scoreDisplayMode !== 'manual' &&
        audit.score < 1
    )
  }

  async auditURLs(urls) {
    for (let i = 0; i < urls.length; i += 1) {
      const url = urls[i]

      console.log(`Visiting ${url}...`)

      // There are race conditions internal to lighthouse preventing us from
      // executing concurrent async functions. See:
      // https://github.com/GoogleChrome/lighthouse/issues/7187.
      const errors = await this.auditPage(url)

      const report = errors.map(error => `* ${error.title}`).join('\n')

      report
        ? console.error(`Issues found:\n${report}\n`)
        : console.log('No issues found.\n')
    }
  }
}

module.exports = Auditor
