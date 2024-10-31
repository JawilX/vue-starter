import type { MaybeRef, UseFetchOptions, UseFetchReturn } from '@vueuse/core'
import type { LocationQueryRaw } from 'vue-router'
import { notNullish } from '@antfu/utils'
import { Message } from '@arco-design/web-vue'
import { createFetch, isObject } from '@vueuse/core'
import { stringifyQuery } from 'vue-router'
import { handleCodeError } from '~/api/errorHandler'

export interface ApiResponse<T> {
  code?: number
  data?: T
  msg?: string
  success?: boolean
  timestamp?: string
  traceId?: string
}

const useRequest = createFetch({
  baseUrl: import.meta.env.VITE_API_URL,
  options: {
    beforeFetch({ options }) {
      options.headers = {
        ...options.headers,
        token: localStorage.getItem('token') || '',
      }
      return { options }
    },
    afterFetch({ data, response }) {
      if (data.code !== 200) {
        handleCodeError(data.code, data.msg)
        data = null
      }
      else {
        data = notNullish(data.data) ? data.data : {}
      }
      return { data, response }
    },
    onFetchError({ data, error }) {
      console.error('onFetchError: ', data, error?.name, error?.message)
      if (error?.name !== 'AbortError')
        Message.error('网络错误，请稍后再试')
      data = undefined
      return { data, error }
    },
  },
  fetchOptions: { mode: 'cors' },
})

/**
 * 封装 get 请求
 * @param url 请求地址
 * @param query 请求参数
 */
export function useGet<T extends ApiResponse<any>>(
  url: MaybeRef<string>,
  query?: MaybeRef<unknown>,
  useFetchOptions?: UseFetchOptions,
): UseFetchReturn<T['data']> {
  const _url = computed(() => {
    const _url = unref(url)
    const _query = unref(query)
    const queryString = (isObject(_query) ? stringifyQuery(_query as LocationQueryRaw) : _query) || ''
    return `${_url}${queryString ? '?' : ''}${queryString}`
  })

  return useRequest<T['data']>(_url, useFetchOptions || {}).json()
}

/**
 * 封装 post 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function usePost<T extends ApiResponse<any>>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
  useFetchOptions?: UseFetchOptions,
): UseFetchReturn<T['data']> {
  return useRequest<T['data']>(url, useFetchOptions || {}).post(payload).json()
}
/**
 * 封装 put 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function usePut<T extends ApiResponse<any>>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
  useFetchOptions?: UseFetchOptions,
): UseFetchReturn<T['data']> {
  return useRequest<T['data']>(url, useFetchOptions || {}).put(payload).json()
}

/**
 * 封装 delete 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function useDelete<T extends ApiResponse<any>>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
  useFetchOptions?: UseFetchOptions,
): UseFetchReturn<T['data']> {
  return useRequest<T['data']>(url, useFetchOptions || {}).delete(payload).json()
}
