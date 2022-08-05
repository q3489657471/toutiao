import request from '@/utils/request'
import storage from '@/utils/storage'

export const getMyChannel = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}

/**
 * 获取所有频道
 * @returns Promise
 */
export const getAllChannels = () =>
  request({
    url: '/v1_0/channels'
  })

/**
 * 删除用户的频道
 * @param {*} target 频道的id
 * @returns Promise
 */
export const delChannel = (target) => {
  return request({
    url: `/v1_0/user/channels/${target}`,
    method: 'DELETE'
  })
}

/**
 * 添加频道
 * @param {*} id 频道id
 * @param {*} seq 添加频道的索引值
 * @returns Promise
 */
export const addChannel = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [{ id, seq }]
    }
  })
}

const HEIMA_TOUTIAO_MY_CHANNELS = 'HEIMA_TOUTIAO_MY_CHANNELS'

export const setMyChannelsToLocal = (myChannels) => {
  storage.set(HEIMA_TOUTIAO_MY_CHANNELS, myChannels)
}

export const getMyChannelByLocal = () => {
  return storage.get(HEIMA_TOUTIAO_MY_CHANNELS)
}
