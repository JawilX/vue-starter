import { defineConfig } from '@jawilx/gen-api'

export default defineConfig({
  apiList: [
    {
      swaggerUrl: '',
      outputDir: '/src/api',
      urlPrefix: '',
      enable: true,
      ignore: /\/test\//,
    },
  ],
  httpTpl: `import type { UseFetchOptions } from '@vueuse/core'`,
  apiBody: ({ url, method, summary, name, formDataStr, outputInterface, pstr1, pstr2 }) => {
    pstr1 = `${pstr1?.replace(/(data\??: )/, '$1MaybeRef<')}>`
    url = url.replace(/\{data/, '{unref(data)')
    return `
            /** ${summary || '无注释'} */
            export function ${name}(${pstr1}, useFetchOptions?: UseFetchOptions): UseFetchReturn<${outputInterface}['data']> {
              return use${method}${formDataStr}<${outputInterface}>(\`${url}\`, ${pstr2}, useFetchOptions)
            }`
  },
})
