import { isString } from '@antfu/utils'
import { Input, type TableColumnData } from '@arco-design/web-vue'
import type { UseFetchReturn } from '@vueuse/core'
import type { IOption } from './options'
import type { SearchProps } from '~/components/SearchForm.vue'

export interface ColumnProps extends TableColumnData {
  key?: keyof typeof keys
  search?: SearchProps | undefined // 搜索项配置
  enum?: EnumProps[] | Ref<EnumProps[]> | ((params?: any) => UseFetchReturn<any>) // 枚举字典
  fieldNames?: IOption // 指定 label && value && children 的 key 值
  span?: number // 每列显示的列数
}

export interface EnumProps {
  label?: string // 选项框显示的文字
  value?: string | number | boolean | any[] // 选项框值
  disabled?: boolean // 是否禁用此选项
  children?: EnumProps[] // 为树形选择时，可以通过 children 属性指定子选项
  [key: string]: any
}

const keys = {
  index: 'index',
  action: 'action',
  name: 'name',
  phone: 'phone',
}

const spanFull = { xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }
const data: readonly ColumnProps[] = [
  { title: '序号', key: 'index', width: 60, render: ({ rowIndex }) => rowIndex + 1 },
  { title: '操作', key: 'action', width: 200, slotName: 'action' },
  { title: '姓名', key: 'name', width: 180, search: { el: Input } },
  { title: '电话', key: 'phone', width: 180, search: { el: Input, ...spanFull } },
]

export type IColumnKey = keyof typeof keys

export function getColumn(key: IColumnKey) {
  return data.find(item => item.dataIndex === key) || {}
}

export function getColumns(columns: (ColumnProps | IColumnKey)[]) {
  const res = []
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
    res.push(column)
  }
  return res
}
