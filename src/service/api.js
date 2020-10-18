/**
 * request
 * @ method
 * @ path
 * @ params
 */
import request from '@/common/service/request'
/**
 * 查询下拉配置项信息
 */
export const getUserInfo = params => request('get', 'http://localhost:3100/user/getInfo', params)
