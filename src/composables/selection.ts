/**
 * @description 表格多选数据操作
 */
export function useSelection(tableData: Ref<any[]>, rowKey: string = 'id') {
  const isSelected = ref<boolean>(false)
  const selectedListIds = ref<(string | number)[]>([])
  const selectedList = ref<{ [key: string]: any }[]>([])

  const selectionChange = (rowKeys: (string | number)[]) => {
    isSelected.value = rowKeys.length > 0
    for (const key of rowKeys) {
      if (!selectedListIds.value.includes(key))
        selectedList.value.push(tableData.value.find(item => item[rowKey] === key))
    }
    for (const key of selectedListIds.value) {
      if (!rowKeys.includes(key))
        selectedList.value.splice(selectedList.value.findIndex(item => item[rowKey] === key), 1)
    }
    selectedListIds.value = rowKeys
  }

  const clearSelection = () => selectionChange([])

  return {
    isSelected,
    selectedList,
    selectedListIds,
    selectionChange,
    clearSelection,
  }
}
