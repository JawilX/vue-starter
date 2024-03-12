export interface IOption {
  value: string | number
  label: string
  children?: IOption[]
}

const optionsAll = { label: '全部', value: '' } as any

export function isOptions(includeAll = false): IOption[] {
  const options = [
    { value: 1, label: '是' },
    { value: 0, label: '否' },
  ]
  if (includeAll)
    options.unshift(optionsAll)

  return options
}

export function getOptionLabel(options: IOption[], value?: string | number | boolean) {
  // eslint-disable-next-line eqeqeq
  return options.find(item => item.value == value)?.label
}
