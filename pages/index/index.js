import request from '../../request/index'
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

Page({

    /**
     * 页面的初始数据
     */
    data: {
        year: new Date().getFullYear(),      // 年份
        month: new Date().getMonth() + 1,    // 月份
        day: new Date().getDate(),
        str: MONTHS[new Date().getMonth()],  // 月份字符串

        days_style: [],
        points: 1,
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
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getUserPonits()

        const days_count = new Date(this.data.year, this.data.month, 0).getDate();
        
        let days_style = new Array;
        for (let i = 1; i <= days_count; i++) {
            const date = new Date(this.data.year, this.data.month - 1, i);
            if (i == 12) {
                days_style.push({
                    month: 'current', day: i, color: 'white', background: '#b49eeb'
                });
            } else if (i == 17) {
                days_style.push({
                    month: 'current', day: i, color: 'white', background: '#f5a8f0'
                });
            } else if (i == 21) {
                days_style.push({
                    month: 'current', day: i, color: 'white', background: '#aad4f5'
                });
            } else if (i == 25) {
                days_style.push({
                    month: 'current', day: i, color: 'white', background: '#84e7d0'
                });
            } else {
                days_style.push({
                    month: 'current', day: i, color: '#a18ada'
                });
            }
        }

        this.setData({
          days_style
        });
    },
    getUserPonits() {
      request({
        url: '/select',
        method: "GET"
      }).then((result) => {
        this.setData({
          points: 100
        })
      }).catch(err => console.log(err))
    }
})