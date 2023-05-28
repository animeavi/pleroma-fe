module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    "ecmaVersion": 2020
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'vue/attribute-hyphenation': 'off',
    'vue/attributes-order': 'off',
    'vue/component-definition-name-casing': 'off',
    'vue/component-tags-order': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-lone-template': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/require-prop-types': 0,
    'vue/v-slot-style': 'off'
  }
}
