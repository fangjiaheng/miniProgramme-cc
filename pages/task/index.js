import request from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [
      {
        id: 1,
        name: '🥤喝一杯水',
        reward: 50,
        finished: false
      },
      {
        id: 2,
        name: '🥤🥤喝两杯水',
        reward: 100,
        finished: false
      },
      {
        id: 3,
        name: '🥤🥤🥤喝三杯水',
        reward: 150,
        finished: false
      },
      {
        id: 4,
        name: '🍙吃早饭',
        reward: 100,
        finished: false
      },
      {
        id: 5,
        name: '🍓吃水果',
        reward: 100,
        finished: false
      },
      {
        id: 6,
        name: '🏃🏻‍♀️运动',
        reward: 100,
        finished: false
      },
      {
        id: 7,
        name: '😪早睡',
        reward: 200,
        finished: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTodayfinishedTask()
  },
  // 获取今天已经完成的任务列表
  getTodayfinishedTask() {
    request({
      url: `/finishedlist`,
      method: "GET"
    }).then((result) => {
      console.log(result)
      let finishedList = result.data.list
      this.data.taskList.forEach((task,index) => {
        finishedList.forEach(item => {
          if(task.id == item) {
            let key = `taskList[${index}].finished`
            this.setData({
              [key]: true
            })
          }
        })
      })
    }).catch(err => console.log(err))
  },
  // 完成任务
  finishtask(e) {
    // console.log(e.currentTarget.dataset.taskid)
    request({
      url: '/finishtask',
      data: {
        taskid: e.currentTarget.dataset.taskid,
        reward: e.currentTarget.dataset.reward
      },
      method: "POST"
    }).then((result) => {
      this.getTodayfinishedTask()
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