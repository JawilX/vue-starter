import { logout } from '~/api/_user'

export enum ApiStatusCode {
  /** 正常响应 */
  SUCCESS = 200,
  /** 会话失效，请重新登录 */
  SESSION_FAILUIRE = 1000,
  /** 认证失败，无法访问系统资源 */
  AUTH_FAILED = 1001,
  /** 未授权,无法访问系统资源 */
  RESOURCE_FORBIDDEN = 1002,
  /** 黑名单用户 */
  BLACK_LIST_USER = 1003,
  /** 非法IP地址 */
  ILLEGAL_IP = 1004,
  /** 网关访问受限 */
  GATEWAY_FORBIDDEN = 1005,
  /** 网关访问异常，请稍后重试 */
  GATEWAY_ERROR = 1006,
  /** 流控异常 */
  TRAFFIC_CONTROL_ERROR = 1007,
  /** 资源找不到服务 */
  RESOURCE_NOT_FOUND = 1008,
  /** 资源请求超时 */
  FETCH_TIMEOUT = 1009,
  /** 资源响应异常 */
  RESOURCE_RESPONSE_ERROR = 1010,
  /** 该员工已被禁用,无法操作 */
  TENANT_EMPLOYEE_FORBID = 1013,
  /** 该账号被顶下线 */
  SESSION_BE_REPLACED = 1014,
  /** 该账号被踢下线 */
  SESSION_IKICK_OUT = 1015,
  /** 用户未选择公司 */
  NO_CDMPANY_CHOSED = 1020,
  /** 请求未携带公司id */
  CARRY_NO_CDMPANY_ID = 1021,
  /** 用户类型错误，当前类型只允许访问企业业务 */
  ENTERPRISE_BUSINESS_ONLY = 1022,
  /** 用户类型错误，当前类型只允许访问个人业务 */
  PERSONAL_BUSINESS_ONLY = 1023,
  /** 用户登录信息异常，请重新登录 */
  USER_CERTIFICATION_ERROR = 1026,
}

export function handleCodeError(code: number, msg: string) {
  let message = ''
  switch (code) {
    case ApiStatusCode.SESSION_FAILUIRE:
      message += '会话失效，请重新登录'
      setTimeout(() => logout(), 800)
      break
    case ApiStatusCode.SESSION_BE_REPLACED:
      message += '该账号被顶下线'
      setTimeout(() => logout(), 800)
      break
    case ApiStatusCode.AUTH_FAILED:
      message += '认证失败，无法访问系统资源'
      break
    default:
      message += msg || '请求异常，请重试'
      break
  }
  AMessage.error(message)
}
