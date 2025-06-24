import type { TableColumnData } from '@arco-design/web-vue'
import type { UseFetchReturn } from '@vueuse/core'
import type { IOption } from './options'
import type { SearchProps } from '~/components/SearchForm.vue'
import { isString } from '@antfu/utils'
import { Input } from '@arco-design/web-vue'

export interface ColumnProps extends TableColumnData {
  search?: SearchProps | undefined // 搜索项配置
  enum?: EnumProps[] | Ref<EnumProps[]> | ((params?: any) => UseFetchReturn<any>) // 枚举字典
  fieldNames?: IOption // 指定 label && value && children 的 key 值
  span?: number // 每列显示的列数
  hidden?: boolean // 是否在表格中隐藏
}

export interface EnumProps {
  label?: string // 选项框显示的文字
  value?: string | number | boolean | any[] // 选项框值
  disabled?: boolean // 是否禁用此选项
  children?: EnumProps[] // 为树形选择时，可以通过 children 属性指定子选项
  [key: string]: any
}

const spanFull = { xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }
const data = {
  index: { title: '序号', dataIndex: 'index', width: 60, render: ({ rowIndex }) => rowIndex + 1 } as ColumnProps,
  action: { title: '操作', dataIndex: 'action', width: 200, slotName: 'action' } as ColumnProps,
  name: { title: '姓名', dataIndex: 'name', width: 180, search: { el: Input } } as ColumnProps,
  phone: { title: '电话', dataIndex: 'phone', width: 180, search: { el: Input, ...spanFull } } as ColumnProps,
} as const

export type IColumnKey = keyof typeof data

export function getColumn(key: IColumnKey, override: Partial<ColumnProps> = {}): ColumnProps {
  return { ...data[key], ...override }
}

export function getColumns(columns: (ColumnProps | IColumnKey)[]) {
  const res = []
  for (const item of columns) {
    let column: ColumnProps
    if (isString(item))
      column = getColumn(item)
    else
      column = item || {}
    try {
      if (!Object.hasOwn(column, 'ellipsis'))
        column.ellipsis = true
      if (!Object.hasOwn(column, 'tooltip'))
        column.tooltip = true
    }
    catch (e) {
      console.error(e)
    }
    res.push(column)
  }
  return res
}
