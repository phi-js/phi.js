module.exports = {
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    // 'prettier/prettier': 'warn',
    // 'vue/max-attributes-per-line': [
    //   'warn',
    //   {
    //     singleline: {
    //       max: 1,
    //       allowFirstLine: true
    //     },
    //     multiline: {
    //       max: 1,
    //       allowFirstLine: false
    //     }
    //   }
    // ]
  }
}
