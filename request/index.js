const baseUrl = "http://127.0.0.1:3000"

const request = (params) => {
  const token = wx.getStorageSync('token')
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: {
        'Authorization': token
      },
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export default request