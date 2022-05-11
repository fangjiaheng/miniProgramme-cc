import request from '../../request/index'
import { formatTime, formatTime2 } from '../../utils/util'

const COLORS = [ '#b49eeb', '#f5a8f0', '#aad4f5', '#84e7d0', '#a18ada' ]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        year: new Date().getFullYear(),      // 年份
        month: new Date().getMonth() + 1,    // 月份
        day: new Date().getDate(),

        days_style: [],
        coins: 0,
        list: [
          {
            id: 0,
            name: '订单'
          },
          {
            id: 1,
            name: '愿望单'
          },
          {
            id: 2,
            name: '留言'
          }
        ],
        signedin: false //是否已签到
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      /**
       * 1.获取用户信息
       * 2.获取用户硬币数
       * 3.获取用户签到情况
       */

      // 获取存储的用户授权信息
      const userinfo =  wx.getStorageSync('userinfo') || {}
      // 判断是否存在已经授权的用户信息
      if (Object.keys(userinfo).length == 0) {
        this.getUserProfile()
      }
      this.getUserCoins()
      this.checkSign()
      this.renderCalender()
    },
    /**
     * 生命周期函数--监听页面显示
    */
    onShow() {
      this.getUserCoins()
    },
    getUserProfile(e) {
      let that = this
      // 获取个人信息
      wx.getUserProfile({
        desc: '用于获取用户个人信息',
        success: function (detail) {
          wx.login({
            success: res => {
              var code = res.code; //登录凭证
              wx.request({
                url: 'http://127.0.0.1:3000/wxuser', //自己的服务接口地址
                method: 'post',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                // 需要传给后端的数据
                data: {
                  encryptedData: detail.encryptedData,
                  iv: detail.iv,
                  code: code,
                  userInfo: detail.rawData
                },
                success: (res) => {
                  // 将用户授权信息存储到本地
                  wx.setStorageSync('userinfo', res.data.userInfo)
                  // 将后端返回的token存储到本地
                  wx.setStorageSync('token', res.data.token)
                  that.setData({
                    userInfo: detail.userInfo,
                    hasUserInfo: true
                  })
                },
                fail: function () {
                  console.log('系统错误')
                }
              })
            }
          });
        },
        fail: function () {
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
    },
    // 获取用户的硬币数
    getUserCoins() {
      request({
        url: `/usercoins`,
        method: "GET"
      }).then((result) => {
        this.setData({
          coins: result.data.coins
        })
      }).catch(err => console.log(err))
    },
    // 渲染日历表
    renderCalender(m = formatTime2(new Date())){
      request({
        url: `/signdates?month=${m}`,
        method: "GET"
      }).then((result) => {
        if(result.data.status === 200){
          let dates = result.data.list.map(date => date.split('-')[2])
          let days_style = []
          dates.forEach(i => {
            days_style.push({
              month: 'current', day: i, color: 'white', background: this.randomColor()
            })
          })
          this.setData({
            days_style
          })
        }
      }).catch(err => console.log(err))
    },
    // 查看是否已经签到
    checkSign() {
      request({
        url: '/signedin',
        method: "GET"
      }).then((result) => {
        this.setData({
          signedin: result.data.signin
        })
      }).catch(err => console.log(err))
    },
    /**
     * 签到
     * 1.日历表添加样式
     * 2.更新可爱币数量
     * 3.弹框提示签到成功,变更状态为已签到, 且无法再次签到
     */
    signIn() {
      if(this.data.signedin) {
        wx.showToast({
          title: '今日已签到过了哦宝贝',
          duration: 1500
        })
        return
      }
      request({
        url: '/signin',
        data: {
          // user_id: userid,
          date: formatTime(new Date())
        },
        method: "POST"
      }).then((result) => {
        // 更新可爱币数量
        this.getUserCoins()
        // 日历表添加样式, 感觉直接往data里添加数据就可以了
        let key = `days_style[${this.data.days_style.length}]`
        this.setData({
          [key]: {
            month: 'current', day: this.data.day, color: 'white', background: this.randomColor()
          }
        })
        // 弹框提示签到成功,变更状态为已签到, 且无法再次签到
        wx.showToast({
          title: '签到成功',
          duration: 1500
        })
        this.setData({
          signedin: true
        })
      }).catch(err => console.log(err))
    },
    // 随机获取一个颜色 渲染到日历上
    randomColor() {
      let i = Math.floor(Math.random() * COLORS.length) 
      return COLORS[i]
    }
})