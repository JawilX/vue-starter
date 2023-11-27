type TargetContext = '_self' | '_parent' | '_blank' | '_top'
export function openWindow(url: string, opts?: { target?: TargetContext, [key: string]: any }) {
  const { target = '_blank', ...others } = opts || {}
  window.open(
    url,
    target,
    Object.entries(others)
      .reduce((preValue: string[], curValue) => {
        const [key, value] = curValue
        return [...preValue, `${key}=${value}`]
      }, [])
      .join(','),
  )
}

export function cloneDeep(obj: any) {
  if (!obj)
    return

  const newObj = Array.isArray(obj) ? [] : {} as any
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null)
      newObj[key] = cloneDeep(value)
    else
      newObj[key] = value
  }
  return newObj
}

/**
 * 日期范围格式化
 */
export function dateRangeFormat(val: string[], mode?: string) {
  if (!val)
    return []

  const start = val[0]
  let end = val[1]

  if (mode === 'year')
    end = end.replace(/-01-01/, '-12-31')

  end = end.replace(/00:00:00/, '23:59:59')
  return [start, end]
}

/**
 * 文本拼接
 * @param text 文本数组
 * @param connector 拼接符
 */
export function textJoin(text: string[], connector = '') {
  return text.filter(item => !!item).join(connector)
}

/**
 * 文本分割
 */
export function textSplit(text?: string, separator = ',') {
  if (!text)
    return []

  return text.split(separator).filter(item => !!item)
}

/** 树展开 */
export function treeFlat(tree: any[], childrenKey = 'children') {
  const res: any[] = []
  const traverse = (t: any[]) => {
    t.forEach((item) => {
      res.push(item)
      if (item[childrenKey])
        traverse(item[childrenKey])
    })
  }
  traverse(tree)
  return res
}
