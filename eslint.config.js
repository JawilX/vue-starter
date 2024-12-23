import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
  },
  {
    rules: {
      'vue/max-attributes-per-line': ['error', {
        singleline: 4,
        multiline: 1,
      }],
    },
  },
)
