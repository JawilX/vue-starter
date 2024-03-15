import type { PaginationProps } from '@arco-design/web-vue'
import type { UseFetchReturn } from '@vueuse/core'

export interface StateProps {
  loading: boolean
  tableData: any[]
  pageable: PaginationProps
  searchParam: {
    [key: string]: any
  }
  searchInitParam: {
    [key: string]: any
  }
  totalParam: {
    [key: string]: any
  }
  icon?: {
    [key: string]: any
  }
}

/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {object} initParam 获取数据初始化参数 (非必传，默认为{})
 * @param {boolean} isPageable 是否有分页 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 */
export function useTable(
  api?: (params: any) => UseFetchReturn<any>,
  initParam: object = {},
  isPageable: boolean = true,
  dataCallBack?: (data: any) => any,
  requestError?: (error: any) => void,
) {
  const state = reactive<StateProps>({
    // 请求时loading
    loading: true,
    // 表格数据
    tableData: [],
    // 分页数据
    pageable: {
      // 当前页数
      current: 1,
      // 每页显示条数
      pageSize: 10,
      // 总条数
      total: 0,
      showPageSize: true,
      showTotal: true,
      showJumper: true,
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {},
  })

  /**
   * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
   */
  const pageParam = computed(() => ({ page: state.pageable.current, size: state.pageable.pageSize }))

  /**
   * @description 更新分页信息
   * @param {object} pageable 后台返回的分页数据
   * @return void
   */
  const updatePageable = (pageable: PaginationProps) => {
    Object.assign(state.pageable, pageable)
  }
  /**
   * @description 获取表格数据
   * @return void
   */
  const getTableList = async () => {
    if (!api)
      return
    try {
      state.loading = true
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, initParam, isPageable ? pageParam.value : {})
      let { data } = await api({ ...state.searchInitParam, ...state.totalParam })
      dataCallBack && (data = dataCallBack(data))
      state.tableData = isPageable ? data.value.records : data.value
      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      if (isPageable) {
        const { current, size, total } = data.value
        updatePageable({ current: Number(current), pageSize: Number(size), total: Number(total) })
      }
    }
    catch (error) {
      requestError && requestError(error)
    }
    state.loading = false
  }

  /**
   * @description 更新查询参数
   * @return void
   */
  const updatedTotalParam = () => {
    state.totalParam = {}
    // 处理查询参数，可以给查询参数加自定义前缀操作
    const nowSearchParam: StateProps['searchParam'] = {}
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (const key in state.searchParam) {
      // 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0)
        nowSearchParam[key] = state.searchParam[key]
    }
    Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParam.value : {})
  }

  /**
   * @description 表格数据查询
   * @return void
   */
  const search = () => {
    state.pageable.current = 1
    updatedTotalParam()
    getTableList()
  }

  /**
   * @description 表格数据重置
   * @return void
   */
  const reset = () => {
    state.pageable.current = 1
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    state.searchParam = { ...state.searchInitParam }
    updatedTotalParam()
    getTableList()
  }

  /**
   * @description 每页条数改变
   * @param {number} val 当前条数
   * @return void
   */
  const handleSizeChange = (val: number) => {
    state.pageable.current = 1
    state.pageable.pageSize = val
    getTableList()
  }

  /**
   * @description 当前页改变
   * @param {number} val 当前页
   * @return void
   */
  const handleCurrentChange = (val: number) => {
    state.pageable.current = val
    getTableList()
  }

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
    updatedTotalParam,
  }
}
