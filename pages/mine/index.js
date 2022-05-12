import request from '../../request/index'

Page({
  data: {
    // 用户信息
    userInfo: {},
    // 判断显示授权前或授权后的样式
    hasUserInfo: false
  },
  onLoad() {
    // 获取存储的用户授权信息
    const userinfo =  wx.getStorageSync('userinfo') || {}
    // 判断是否存在已经授权的用户信息
    if (Object.keys(userinfo).length == 0) {
      this.setData({
        userInfo: userinfo,
        hasUserInfo: false
      })
    } else {
      this.setData({
        userInfo: userinfo,
        hasUserInfo: true
      })
    }
  },
  getUserProfile(e) {
    let that = this
    // 获取个人信息
    wx.getUserProfile({
      desc: '用于获取用户个人信息',
      success: detail => {
        request({
          url: '/updateuserinfo',
          data: { userInfo: detail.rawData },
          method: "POST"
        }).then((result) => {
          wx.setStorageSync('userinfo', result.data.userInfo)
          this.setData({
            userInfo: result.data.userInfo,
            hasUserInfo: true
          })
        }).catch(err => console.log(err))
      },
      fail: ()=> {
       wx.showModal({
         content: '取消授权将会影响相关服务，您确定取消授权吗？',
         success (res) {
           if (res.confirm) {
             wx.showToast({
               title: '已取消授权',
               duration: 1500
             })
           } else if (res.cancel) {
             that.getUserProfile()
           }
         }
       })
      }
    })
  }
})
