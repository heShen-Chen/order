//index.js
//获取应用实例
const app = getApp()
const fetch=require('../../utils/fetch')
Page({
  data: {
   
  },
  
  onLoad: function () {
    wx.showLoading({title: '努力加载中',})
    fetch('index').then(res=>{
      //请求成功,关闭提示框
      wx.hideLoading();
      //把接口返回数据给listData
      this.setData({listData:res.data})
    }),()=>{
      //请求失败,关闭提示框执行fetch.js文件中的方法
      wx.hideLoading()
    }
  },
  gostart:function(){
    wx.navigateTo({
      url: '../list/list',
    })
  }
})
