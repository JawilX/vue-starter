import { defineConfig } from '@jawilx/gen-api'

export default defineConfig({
  apiList: [
    {
      swaggerUrl: '',
      outputDir: '/src/api',
      enable: true,
      ignore: /\/test\//,
    },
  ],
  httpTpl: 'import type { UseFetchOptions } from \'@vueuse/core\'',
  apiBody: ({ url, method, summary, name, formDataStr, outputInterface, pstr1, pstr2 }) => {
    return `
            /** ${summary || '无注释'} */
            export function ${name}(${pstr1}, useFetchOptions?: UseFetchOptions) {
              return use${method}${formDataStr}<${outputInterface}>(\`${url}\`, ${pstr2}, useFetchOptions)
            }`
  },
})
