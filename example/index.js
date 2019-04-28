#!/usr/bin/env node

const auditor = require('lighthouse-audit')

;(async () => {
  new auditor({
    // Perform any necessary authentication steps.
    authHandler: async browser => {},
    // Set Chrome flags.
    chromeFlags: ['--headless', '--no-sandbox'],
    // URLs to visit before login.
    preAuthURLs: [],
    // URLs to visit after login.
    postAuthURLs: []
  }).run()
})()
