import request from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rewardList: [
      {
        id: 1,
        name: '🍥辣条',
        payment: 50,
        exchange: false, // 是否已兑换
      },
      {
        id: 2,
        name: '🍦冰淇淋',
        payment: 300,
        exchange: true
      },
      {
        id: 3,
        name: '⛓项链',
        payment: 300,
        exchange: false
      },
      {
        id: 4,
        name: '💫耳环',
        payment: 300,
        exchange: false
      },
      {
        id: 5,
        name: '💄口红',
        payment: 300,
        exchange: false
      },
      {
        id: 6,
        name: '💁‍♀️粉底液',
        payment: 300,
        exchange: false
      },
      {
        id: 7,
        name: '🌈精华',
        payment: 10000,
        exchange: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 兑换商品
  exchange(e) {
    // 发起兑换请求
    request({
      url: '/exchangegoods',
      data: {
        goodsid: e.currentTarget.dataset.goodsid,
        consume: e.currentTarget.dataset.consume
      },
      method: "POST"
    }).then((result) => {
      console.log(result)
      if(result.data.status == 500) {
        // 兑换失败
        wx.showToast({
          title: '所需硬币不够',
          icon: 'error'
        })
      } else if(result.data.status == 200) {
        // 兑换成功
        wx.showToast({
          title: '兑换成功'
        })
      }
    }).catch(err => console.log(err))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})