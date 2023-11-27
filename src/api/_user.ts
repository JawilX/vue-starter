import type { ApiResponse } from '~/composables/request'

/** 菜单权限 */
export interface IMenuRes {
  menuRoute: IMenuRoute[]
  permission: string[]
}

export interface IMenuRoute {
  children?: IMenuRoute[]
  id?: number
  meta: IMeta
  name?: string
  path?: string
  query?: string
  redirect?: string
}

export interface IMeta {
  hideInMenu?: boolean
  hideChildrenInMenu?: boolean
  icon?: string
  locale: string
  menuType?: number
  order?: number
  requiresAuth?: boolean
}

/** 租户信息 */
export interface ITenantInfo {
  /** 认证状态?: 未认证 UNCERTIFICATED, 已认证 CERTIFIED */
  authStatus?: string
  /** 是否绑定渠道 */
  channelBindStatus?: string
  /** 渠道corpId */
  channelCorpId?: string
  /** 渠道类型 */
  channelType?: string
  /** 是否选中 */
  checked?: boolean
  /** 当前租户下员工状态 NONACTIVATED未激活,NORMAL正常,FORBID禁用 */
  employeeStatus?: string
  /** 是否为创建人 ture-是 false-否 */
  init?: boolean
  /** 租户类型,ENTERPRISE 企业租户,PERSON 个人租户,PLATFORM 平台租户 */
  kind?: string
  /** 租户状态（NORMAL正常 STOP停用） */
  status?: string
  /** 租户id */
  tenantId?: number
  /** 租户名称 */
  tenantName?: string
  /** 租户创建者id */
  userId?: number
}

/** 员工信息 */
export interface IEmployeeInfo {
  /** 加入时间 */
  created?: Date
  createId?: number
  /** 邀请人 */
  createName?: string
  /** 员工邮箱 */
  email?: string
  /** 员工id */
  id?: number
  /** 手机号 */
  mobile?: string
  modified?: Date
  /** 员工昵称 */
  nickName?: string
  /** 关联关系：INIT:创建人，CREATE：后台添加，INVITE:邀请加入，ADD:搜索加入 */
  relation?: string
  /** 性别,man:表示男性,woman表示女性，unknown未知 */
  sex?: string
  sexDesc?: string
  /** 账号状态：NONACTIVATED未激活,NORMAL正常,FORBID禁用 */
  status?: string
  updateId?: number
  updateName?: string
  /** 账号id */
  userId?: number
  /** 员工姓名 */
  userName?: string
}

/** 当前登录者的用户菜单路由+权限信息 */
export function fetchMenuList() {
  return useGet<ApiResponse<IMenuRes>>(`/api/index/getCurrentAuth`)
}

/** 获取当前的租户信息 */
export function fetchTenantInfo() {
  return useGet<ApiResponse<ITenantInfo>>(`/api/tenant/acquirePresentTenantInfo`)
}

/** 获取当前员工信息 */
export function fetchEmployeeInfo() {
  return useGet<ApiResponse<IEmployeeInfo>>(`/api/index/getCurrentEmployee`)
}

export function login() {}

export function logout() {
  localStorage.clear()
}
