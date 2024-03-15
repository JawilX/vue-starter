import { isString } from '@antfu/utils'
import { Input, type TableColumnData } from '@arco-design/web-vue'
import type { UseFetchReturn } from '@vueuse/core'
import type { IOption } from './options'
import type { SearchProps } from '~/components/SearchForm.vue'

export interface ColumnProps extends TableColumnData {
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

// eslint-disable-next-line unused-imports/no-unused-vars
const spanFull = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }
const data: readonly ColumnProps[] = [
  { title: '序号', dataIndex: keys.index, width: 60, render: ({ rowIndex }) => rowIndex + 1 },
  { title: '操作', dataIndex: keys.action, width: 200, slotName: 'action' },
  { title: '姓名', dataIndex: keys.name, width: 180, search: { el: Input } },
  { title: '电话', dataIndex: keys.phone, width: 180, search: { el: Input } },
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
