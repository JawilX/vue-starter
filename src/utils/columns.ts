import type { TableColumnData } from '@arco-design/web-vue'

const keys = {
  index: 'index',
  action: 'action',
}

const data: readonly TableColumnData[] = [
  { title: '序号', dataIndex: keys.index, width: 60, render: ({ rowIndex }) => rowIndex + 1 },
  { title: '操作', dataIndex: keys.action, width: 200, slotName: 'action' },
]

export type IColumnKey = keyof typeof keys

export function getColumn(key: IColumnKey) {
  return data.find(item => item.dataIndex === key) || {}
}
