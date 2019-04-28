module.exports = {
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 8
  },
  rules: {
    'no-console': 'off'
  }
}
