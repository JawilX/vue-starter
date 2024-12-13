<script setup lang="ts">
import type { ColumnProps } from '~/utils/columns'
import { notNullish } from '@antfu/utils'
import { Option } from '@arco-design/web-vue'

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

const isSelect = computed(() => props.column.search?.el?.name?.includes('Select'))
const isPicker = computed(() => props.column.search?.el?.name?.includes('Picker'))

const popupVisible = ref(false)
const isHover = ref(false)
const showValue = computed(() => {
  const value = _searchParam.value[props.column.dataIndex!]
  const isArray = Array.isArray(value)
  if (props.column.enum) {
    if (isArray)
      return value.map(i => columnEnum.value.find(j => j.value === i)?.[fieldNames.value.label]).join(', ')
    return columnEnum.value.find(i => i.value === value)?.[fieldNames.value.label]
  }
  return isArray ? value.join(' - ') : value?.toString()
})

// 处理透传的 searchProps
const handleSearchProps = computed(() => {
  const label = fieldNames.value.label
  const value = fieldNames.value.value
  const children = fieldNames.value.children
  const searchEl = props.column.search?.el
  let searchProps = props.column.search?.props ?? {}
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

const componentRef = ref<any>()
watch(
  () => popupVisible.value,
  (val) => {
    if (val)
      nextTick(() => componentRef.value?.focus?.())
  },
)
</script>

<template>
  <ATrigger
    v-model:popup-visible="popupVisible"
    class="mr-4 cursor-pointer"
    :content-class="isSelect || isPicker ? 'h-0 overflow-hidden -mt-8' : ''"
    trigger="click"
    position="bl"
    auto-fit-popup-min-width
    :popup-offset="4"
    :popup-container="$parent?.$el"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div
      class="h-[28px] cursor-pointer rounded bg-[#f2f3f5] px-2 py-1 leading-snug hover:text-[#376af6] hover:!bg-[#e1e9fe]"
      :class="popupVisible ? '!bg-[#e1e9fe] text-[#376af6]' : showValue ? '!bg-[#376af626] ' : ''"
    >
      <span>{{ column.title }}{{ showValue ? ': ' : '' }}</span>
      <ATooltip v-if="showValue?.length > 10" :content="showValue">
        <span>
          {{ column.search?.el?.name?.includes('Range') ? showValue.slice(0, 15) : showValue.slice(0, 10) }}...
        </span>
      </ATooltip>
      <span v-else-if="showValue">{{ showValue }}</span>
      <AIconCloseCircleFill
        v-if="showValue && isHover && !popupVisible && allowClear"
        class="ml-1"
        @click.stop="_searchParam[column.dataIndex!] = ''"
      />
      <AIconCaretUp v-else-if="popupVisible" class="mb-[2px] ml-1 !h-[10px] !w-[10px]" />
      <AIconCaretDown v-else class="mb-[2px] ml-1 !h-[10px] !w-[10px]" />
    </div>

    <template #content>
      <component
        :is="column.search?.render ?? column.search?.el"
        ref="componentRef"
        v-bind="{ ...handleSearchProps, ...placeholder, searchParam: _searchParam, allowClear }"
        v-model:popup-visible="popupVisible"
        v-model.trim="_searchParam[column.search?.key ?? column.dataIndex!]"
        :data="column.search?.el?.name === 'TreeSelect' ? columnEnum : []"
        :options="column.search?.el?.name === 'Cascader' ? columnEnum : []"
        value-format="YYYY-MM-DD HH:mm:ss"
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
        <slot v-else />
      </component>
    </template>
  </ATrigger>
</template>

<style scoped></style>
