declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_SOURCE_SYSTEM: string
  readonly VITE_BASE_API_URL: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
