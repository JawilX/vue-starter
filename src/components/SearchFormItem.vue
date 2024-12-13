<script setup lang="ts">
import type { ColumnProps } from '~/utils/columns'
import { notNullish } from '@antfu/utils'
import { Option, Radio } from '@arco-design/web-vue'

interface SearchFormItem {
  column: ColumnProps
  searchParam: { [key: string]: any }
}
const props = defineProps<SearchFormItem>()

// Re receive SearchParam
const _searchParam = computed(() => props.searchParam)

// 判断 fieldNames 设置 label && value && children 的 key 值
const fieldNames = computed(() => {
  return {
    label: props.column.fieldNames?.label ?? 'label',
    value: props.column.fieldNames?.value ?? 'value',
    children: props.column.fieldNames?.children ?? 'children',
  }
})

// 接收 enumMap
const enumMap = inject('enumMap', ref(new Map()))
const columnEnum = computed(() => {
  const enumData = enumMap.value.get(props.column.dataIndex)
  if (!enumData)
    return []
  return enumData
})

// 处理透传的 searchProps
const handleSearchProps = computed(() => {
  const label = fieldNames.value.label
  const value = fieldNames.value.value
  const children = fieldNames.value.children
  const searchEl = props.column.search?.el
  let searchProps = props.column.search?.props ?? {}
  if (searchEl?.name === 'RadioGroup')
    searchProps = { type: 'button', ...searchProps }
  if (searchEl?.name === 'TreeSelect') {
    searchProps = {
      fieldNames: { key: value, title: label, children },
      allowSearch: true,
      treeCheckable: true,
      ...searchProps,
    }
  }

  return searchProps
})

// 处理默认 placeholder
const placeholder = computed(() => {
  const search = props.column.search
  if (search?.props?.isRange || search?.el?.name?.includes('Range')) {
    return {
      placeholder: [search?.props?.startPlaceholder ?? '开始时间', search?.props?.endPlaceholder ?? '结束时间'],
    }
  }
  const placeholder = search?.props?.placeholder ?? (search?.el?.name === 'Input' ? '请输入' : '请选择')
  return { placeholder }
})

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const allowClear = computed(() => {
  const search = props.column.search
  return search?.props?.clearable ?? !notNullish(search?.defaultValue)
})
</script>

<template>
  <component
    :is="column.search?.render ?? column.search?.el"
    v-bind="{ ...handleSearchProps, ...placeholder, searchParam: _searchParam, allowClear }"
    v-model.trim="_searchParam[column.search?.key ?? column.dataIndex!]"
    :data="column.search?.el?.name === 'TreeSelect' ? columnEnum : []"
    :options="column.search?.el?.name === 'Cascader' ? columnEnum : []"
    value-format="YYYY-MM-DD HH:mm:ss"
    :class="{ 'flex-wrap': column.search?.el?.name === 'RadioGroup' }"
  >
    <template v-if="column.search?.el?.name === 'Select'">
      <component
        :is="Option"
        v-for="(col, index) in columnEnum"
        :key="index"
        :label="col[fieldNames.label]"
        :value="col[fieldNames.value]"
      />
    </template>
    <template v-if="column.search?.el?.name === 'RadioGroup'">
      <component
        :is="Radio"
        v-for="(col, index) in columnEnum"
        :key="index"
        :value="col[fieldNames.value]"
      >
        {{ col[fieldNames.label] }}
      </component>
    </template>
    <slot v-else />
  </component>
</template>
