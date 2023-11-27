import type { PaginationProps, TableBorder, TableColumnData, TableRowSelection, TableSortable } from '@arco-design/web-vue'
import type { MaybeRef, UseFetchReturn } from '@vueuse/core'
import { isString } from '@antfu/utils'
import type { IColumnKey } from '~/utils/columns'
import { getColumn } from '~/utils/columns'

type Size = 'mini' | 'small' | 'medium' | 'large'
export interface IDefaultProps {
  /** 是否显示边框 */
  bordered?: TableBorder
  /** 是否显示选中效果 */
  hoverable?: boolean
  /** 表格的大小 */
  size?: Size
  /** 是否允许调整列宽 */
  'column-resizable'?: boolean
  /** 是否为加载中状态 */
  loading?: boolean
  /** 分页参数 */
  pagination?: PaginationProps
  /** table数据类型 */
  data?: any[]
  /** 表头参数 */
  columns?: TableColumnData[]
  /** 表格行 key 的取值字段 */
  'row-key'?: string
  /** 表格的行选择器配置 */
  'row-selection'?: TableRowSelection
  'selected-keys'?: (string | number)[]
  [x: string]: any
}
export interface IPagination {
  /** 当前页数 */
  current?: number
  /** 总页数默认是0条 */
  total?: number
  /** 单页时隐藏 */
  hideOnSinglePage?: boolean
}
export interface ITableResponse<T> {
  current?: number
  records?: T[]
  size?: number
  total?: number
  [x: string]: any
}
type GetListFunc<T> = (v: any) => UseFetchReturn<ITableResponse<T>>
export function useTableProps<T>(loadListFunc: GetListFunc<T>, recordProcessFn?: (record: any) => any) {
  const defaultProps: IDefaultProps = {
    'bordered': { cell: true },
    'size': 'large',
    'column-resizable': true,
    'loading': true,
    'data': [] as any[],
    'pagination': {
      current: 1,
      pageSize: 10,
      total: 0,
      showPageSize: true,
      showTotal: true,
      hideOnSinglePage: false,
    },
    'hoverable': false,
    'columns': [],
  }
  //* 属性组
  const propsRes = reactive<IDefaultProps>(defaultProps)
  //* 设置请求参数，如果出了分页参数还有搜索参数，在模板页面调用此方法，可以加入参数
  const loadListParams = reactive<any>({
    page: 1,
    size: 20,
  })
  /**
   * 单独设置默认属性
   * @param params
   */
  const setProps = (params: IDefaultProps) => {
    if (Object.keys(params).length > 0)
      Object.assign(defaultProps, params)
  }
  /**
   * 设置表头数据
   * @param columns
   */
  const setColumns = (columns: (TableColumnData | IColumnKey)[]) => {
    propsRes.columns = []
    for (const item of columns) {
      let column
      if (isString(item))
        column = getColumn(item)
      else
        column = item || {}
      if (!Object.hasOwn(column, 'ellipsis'))
        column.ellipsis = true
      if (!Object.hasOwn(column, 'tooltip'))
        column.tooltip = true
      propsRes.columns.push(column)
    }
  }
  /** column sortable */
  const sortable: TableSortable = { sortDirections: ['ascend', 'descend'], sorter: true }
  /**
   * 设置loading
   * @param status
   */
  const setLoading = (status: MaybeRef<boolean>) => {
    propsRes.loading = unref(status)
  }
  /**
   * 设置分页
   */
  const setPagination = ({ current, total, hideOnSinglePage = false }: IPagination) => {
    propsRes.pagination!.current = Number(current)
    total && (propsRes.pagination!.total = Number(total))
    propsRes.pagination!.hideOnSinglePage = hideOnSinglePage
    Object.assign(loadListParams, { page: Number(current), size: propsRes.pagination?.pageSize })
  }
  /**
   * 设置列表请求参数
   * @param params
   */
  const setLoadListParams = <R>(params?: R) => {
    Object.assign(loadListParams, params)
  }
  /**
   * 加载列表
   */
  const loadTableData = async (resetPageIndex = false) => {
    if (resetPageIndex)
      setPagination({ current: 1 })

    try {
      setLoading(true)
      const { data } = await loadListFunc({ ...loadListParams })
      setLoading(false)
      if (data.value?.records?.length === 0 && data.value.current! > 1) {
        setPagination({ current: data.value.current! - 1 })
        const res = await loadListFunc({ ...loadListParams })
        data.value = res.data.value
      }
      propsRes.data = recordProcessFn ? data.value?.records?.map(recordProcessFn) : data.value?.records
      setPagination({
        current: data.value?.current,
        total: data.value?.total,
      })
      return data
    }
    catch (error) {
      setLoading(false)
    }
  }

  // 事件触发组
  const propsEvent = reactive({
    // 排序触发
    sorterChange: (_dataIndex: string, _direction: string) => {
      // console.log(_dataIndex, _direction)
    },
    // 分页触发
    pageChange: (current: number) => {
      setPagination({ current })
      loadTableData()
    },
    // 修改每页显示条数
    pageSizeChange: (size: number) => {
      propsRes.pagination!.pageSize = size
      Object.assign(loadListParams, { size })
      loadTableData()
    },
    selectionChange: (rowKeys: (string | number)[]) => {
      propsRes['selected-keys'] = rowKeys
    },
  })

  return {
    propsRes,
    propsEvent,
    loadListParams,
    setProps,
    setColumns,
    sortable,
    setLoading,
    setPagination,
    loadTableData,
    setLoadListParams,
  }
}
