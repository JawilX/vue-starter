<script setup lang="ts">
import { notNullish } from '@antfu/utils'
import type { ResponsiveValue, TableBorder, TableColumnData, TableInstance } from '@arco-design/web-vue'
import type { UseFetchReturn } from '@vueuse/core'
import { getColumns } from '~/utils/columns'
import type { ColumnProps, IColumnKey } from '~/utils/columns'

export interface ProTableProps {
  columns: (TableColumnData | IColumnKey)[] // 列配置项  ==> 必传
  data?: any[] // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => UseFetchReturn<any> // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (params: any) => void // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string // 表格标题 ==> 非必传
  pagination?: boolean // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any // 初始化请求参数 ==> 非必传（默认为{}）
  bordered?: boolean | TableBorder // 是否带有纵向边框 ==> 非必传（默认为 { cell: true }）
  rowKey?: string // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  selectable?: boolean // 行选择器 ==> 非比传 (默认为false)
  searchCols?: number | ResponsiveValue // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }
  showSearch?: boolean // 是否显示搜索框 ==> 非必传（默认为true）
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initParam: () => ({}),
  bordered: () => ({ cell: true } as TableBorder),
  rowKey: 'id',
  selectable: false,
  searchCols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 6 } as ResponsiveValue),
  showSearch: true,
})

// 定义 emit 事件
const emit = defineEmits<{
  (e: 'search'): void
  (e: 'reset'): void
}>()

const tableRef = ref<TableInstance>()

const { tableData, loading, pageable, searchParam, searchInitParam, getTableList, search, reset, handleSizeChange, handleCurrentChange }
  = useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback, props.requestError)

const { isSelected, selectedList, selectedListIds, selectionChange, clearSelection } = useSelection(tableData, props.rowKey)

// 处理表格数据
const processTableData = computed(() => {
  if (!props.data)
    return tableData.value
  if (!props.pagination)
    return props.data
  return props.data.slice(
    ((pageable.value.current ?? 1) - 1) * (pageable.value.pageSize ?? 10),
    (pageable.value.pageSize ?? 10) * (pageable.value.current ?? 1),
  )
})

const tableColumns = ref<ColumnProps[]>(getColumns(props.columns))

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>())
async function setEnumMap({ dataIndex, enum: enumValue }: ColumnProps) {
  if (!enumValue)
    return

  // 如果当前 enumMap 存在相同的值 return
  if (enumMap.value.has(dataIndex!) && (typeof enumValue === 'function' || enumMap.value.get(dataIndex!) === enumValue))
    return

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof enumValue !== 'function')
    return enumMap.value.set(dataIndex!, unref(enumValue!))

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(dataIndex!, [])

  // 当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  const { data } = await enumValue()
  enumMap.value.set(dataIndex!, data.value)
}

tableColumns.value.forEach(async (col) => {
  // 设置 enumMap
  await setEnumMap(col)
})

// 注入 enumMap
provide('enumMap', enumMap)

// 过滤需要搜索的配置项 && 排序
const searchColumns = computed(() => {
  return tableColumns.value
    ?.filter(item => item.search?.el || item.search?.render)
    .sort((a, b) => b.search!.order! - a.search!.order!)
})

// 设置 搜索表单默认排序 && 搜索表单项的默认值
searchColumns.value?.forEach((column, index) => {
  column.search!.order = column.search?.order ?? index + 2
  const key = column.search?.key ?? column.dataIndex
  const defaultValue = column.search?.defaultValue
  if (key && notNullish(defaultValue)) {
    searchInitParam.value[key] = defaultValue
    searchParam.value[key] = defaultValue
  }
})

onMounted(() => {
  if (props.requestAuto)
    getTableList()
})

// 监听页面 initParam 改变，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true })

function _search() {
  search()
  emit('search')
}

function _reset() {
  reset()
  emit('reset')
}

// 暴露给父组件的参数和方法 (外部需要什么，都可以从这里暴露出去)
defineExpose({
  element: tableRef,
  tableData: processTableData,
  pageable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
  clearSelection,
  enumMap,
  setEnumMap,
  isSelected,
  selectedList,
  selectedListIds,
})
</script>

<template>
  <SearchForm
    v-if="showSearch"
    :columns="searchColumns"
    :search-param="searchParam"
    :search-cols="searchCols"
    :search="_search"
    :reset="_reset"
    class="mb-4"
  />

  <div class="flex gap-4">
    <slot name="tableHeader" :selected-list="selectedList" :selected-list-ids="selectedListIds" :is-selected="isSelected" />
    <div class="flex-1" />
    <slot name="tableHeaderSuffix" :selected-list="selectedList" :selected-list-ids="selectedListIds" :is-selected="isSelected" />
  </div>

  <ATable
    ref="tableRef"
    v-bind="$attrs"
    class="px-4 pb-0"
    :bordered="bordered"
    :loading="loading"
    :row-key="rowKey"
    :row-selection="selectable ? { type: 'checkbox', showCheckedAll: true, selectedRowKeys: selectedListIds } : undefined"
    :columns="tableColumns"
    :data="processTableData"
    :pagination="pageable"
    @selection-change="selectionChange"
    @page-size-change="handleSizeChange"
    @page-change="handleCurrentChange"
  >
    <template
      v-for="item in tableColumns.filter((i) => i.slotName)"
      :key="item.slotName"
      #[item.slotName!]="{ column, record, rowIndex }"
    >
      <slot :name="item.slotName" v-bind="{ column, record, rowIndex }" />
    </template>
  </ATable>
</template>
