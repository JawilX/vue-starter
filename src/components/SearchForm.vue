<script setup lang="ts">
import type { Cascader, DatePicker, Input, InputNumber, MonthPicker, QuarterPicker, RadioGroup, RangePicker, ResponsiveValue, Select, Slider, Switch, TreeSelect, WeekPicker, YearPicker } from '@arco-design/web-vue'
import { IconDown, IconUp } from '@arco-design/web-vue/es/icon'
import type { ColumnProps, EnumProps } from '~/utils/columns'

export type SearchType =
  | typeof Input
  | typeof InputNumber
  | typeof Select
  | typeof TreeSelect
  | typeof Cascader
  | typeof DatePicker
  | typeof YearPicker
  | typeof MonthPicker
  | typeof QuarterPicker
  | typeof WeekPicker
  | typeof RangePicker
  | typeof Switch
  | typeof RadioGroup
  | typeof Slider

export interface SearchRenderScope {
  searchParam: { [key: string]: any }
  placeholder: string
  clearable: boolean
  options: EnumProps[]
  data: EnumProps[]
}

export type SearchProps = {
  el?: SearchType // 当前项搜索框的类型
  label?: string // 当前项搜索框的 label
  props?: any // 搜索项参数，根据 arco design 官方文档来传递，该属性所有值会透传到组件
  key?: string // 当搜索项 key 不为 prop 属性时，可通过 key 指定
  tooltip?: string // 搜索提示
  order?: number // 搜索项排序（从大到小）
  span?: number // 搜索项所占用的列数，默认为 1 列
  offset?: number // 搜索字段左侧偏移列数
  defaultValue?: string | number | boolean | any[] | Ref<any> // 搜索项默认值
  render?: (scope: SearchRenderScope) => VNode // 自定义搜索内容渲染（tsx语法）
} & ResponsiveValue

export interface SearchFormProps {
  columns?: ColumnProps[] // 搜索配置列
  hideSearchButton?: boolean // 是否隐藏搜索按钮
  searchParam?: { [key: string]: any } // 搜索参数
  searchCols: number | ResponsiveValue
  collapsedRows?: number // 搜索项默认折叠行数
  search: (params: any) => void // 搜索方法
  reset: (params: any) => void // 重置方法
}

// 默认值
const props = withDefaults(defineProps<SearchFormProps> (), {
  collapsedRows: 1,
  columns: () => [],
  searchParam: () => ({}),
})

// 是否默认折叠搜索项
const collapsed = ref(true)

const breakPoint = ref<keyof ResponsiveValue>('xxl')
// 监听屏幕变化
function resize(e: UIEvent) {
  const width = (e.target as Window).innerWidth
  switch (!!width) {
    case width < 576:
      breakPoint.value = 'xs'
      break
    case width >= 576 && width < 768:
      breakPoint.value = 'sm'
      break
    case width >= 768 && width < 992:
      breakPoint.value = 'md'
      break
    case width >= 992 && width < 1200:
      breakPoint.value = 'lg'
      break
    case width >= 1200 && width < 1600:
      breakPoint.value = 'xl'
      break
    case width >= 1600:
      breakPoint.value = 'xxl'
      break
  }
}
onMounted(() => {
  resize({ target: { innerWidth: window.innerWidth } } as unknown as UIEvent)
  window.addEventListener('resize', resize)
})
onActivated(() => {
  resize({ target: { innerWidth: window.innerWidth } } as unknown as UIEvent)
  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
onDeactivated(() => {
  window.removeEventListener('resize', resize)
})

// 判断是否显示 展开/收起 按钮
const showCollapse = computed(() => {
  let show = false
  props.columns.reduce((prev, current) => {
    prev += (current.search![breakPoint.value] ?? current.search?.span ?? 1) + (current.search?.offset ?? 0)
    if (typeof props.searchCols !== 'number' && props.searchCols) {
      if (prev >= (props.searchCols[breakPoint.value] || 0))
        show = true
    }
    else {
      if (prev >= props.searchCols)
        show = true
    }
    return prev
  }, 0)
  return show
})

// 接收 enumMap
const enumMap = inject('enumMap', ref(new Map()))
function isRadioGroupAndEmpty(column: ColumnProps) {
  const enumData = enumMap.value.get(column.dataIndex)
  return column.search?.el?.name === 'RadioGroup' && !enumData?.length
}
</script>

<template>
  <AForm class="border-b border-b-gray-2 px-4 pt-4" :model="searchParam" layout="inline">
    <AGrid class="w-full" :cols="searchCols" :col-gap="12" :collapsed="collapsed" :collapsed-rows="collapsedRows">
      <template v-for="item in columns" :key="item.dataIndex">
        <AGridItem v-if="!isRadioGroupAndEmpty(item)" :span="item.search![breakPoint] ?? item.search!.span ?? 1">
          <AFormItem :label="String(item.title)" :field="item.dataIndex">
            <SearchFormItem :column="item" :search-param="searchParam" />
          </AFormItem>
        </AGridItem>
      </template>
      <AGridItem v-if="!hideSearchButton" suffix content-class="justify-end">
        <AFormItem hide-label content-class="justify-end">
          <AButton type="primary" @click="search">
            查询
          </AButton>
          <AButton class="ml-4" @click="reset">
            重置
          </AButton>
          <AButton v-if="showCollapse" class="ml-4" @click="collapsed = !collapsed">
            {{ collapsed ? '展开' : '收起' }}
            <component :is="collapsed ? IconDown : IconUp" />
          </AButton>
        </AFormItem>
      </AGridItem>
    </AGrid>
  </AForm>
</template>
