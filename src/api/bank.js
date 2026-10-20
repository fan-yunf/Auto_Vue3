import request from '@/utils/request'

// 获取菜单列表接口 GET /banksystem/list
export function getBankMenuList() {
  return request({
    url: '/banksystem/list',
    method: 'get'
  })
}
