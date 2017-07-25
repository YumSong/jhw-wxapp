/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 首页
*/
var app = getApp()

Page({
  data: {
    images: [
      'http://img.easthardware.com/upload/j/j2/jihui/picture/2016/02/16/9e4246d9-7150-49f0-af69-237598418759.png'
    ],
    list: [],
    enterprise: {}
  },
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    console.log('首页数据加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/all/' + app.globalData.enterpriseId + '?page=1&per_page=4',
      success: function (res) {
        that.setData({
          list: res.data.list
        })
        wx.setStorage({
          key: 'goods',
          data: res.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
  },

  getEnter: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/comm/enterprise/info?enterpriseId='+ app.globalData.enterpriseId,
      data: {
        skey: app.globalData.member.skey
      },
      success: function (res) {
        var data = res.data.attributes.data
        data.logo = data.logo || 'upload/j/j2/jihui/picture/2015/12/01/d6cdd11d-c7fd-4d92-a2a6-ba489bc6b347_5.png'
        data.phone = data.phone || '400-7111-011'
        data.name = data.name || '机汇网商城'
        that.setData({
          enterprise: data
        })
        wx.setStorage({
          key: 'enterprise',
          data: data
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  onLoad: function () {
    var key = wx.getStorageSync('goods')
    if (!key) {
      this.get()
    } else {
      this.setData({
        list: key
      })
    }
  },
  onReady: function () {
    var key = wx.getStorageSync('enterprise')
    if (!key) {
      this.getEnter()
    } else {
      this.setData({
        enterprise: key
      })
    }
    wx.setNavigationBarTitle({
      title: this.data.enterprise.name
    })
  },
  onPullDownRefresh: function () {
    this.get()
    this.getEnter()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      title: this.data.enterprise.name
    }
  }
})
