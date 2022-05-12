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
            name: '兑换记录'
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
      this.login().then(() => {
        this.getUserCoins()
        this.checkSign()
        this.renderCalender()
      })
    },
    /**
     * 生命周期函数--监听页面显示
    */
    onShow() {
      this.getUserCoins()
    },
    login(){
      return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            var code = res.code; //登录凭证
            wx.request({
              url: 'http://127.0.0.1:3000/wxuser',
              method: 'post',
              header: {'content-type': 'application/x-www-form-urlencoded'},
              data: { code },
              success: (res) => {
                // 将后端返回的token存储到本地
                wx.setStorageSync('token', res.data.token)
                resolve()
              },
              fail: function () {
                reject('系统错误')
              }
            })
          }
        })
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