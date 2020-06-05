// pages/order/balance/balance.js
const fetch =require("../../../utils/fetch.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sumMoney:0, //总金额
    cutMoney:0, //满减金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接收传递过来的参数
    // console.log(options.order_id)
    //获取订单数据
    fetch('order',{order_id:1}).then(res=>{
      //计算总金额
      var sum=0
      var foods=res.data.foods
      for(var i=0;i<foods.length;i++){
          sum+=foods[i].price *foods[i].num
      }
      //处理满减
      if(sum>=res.data.promotion.discount){
        sum-=res.data.promotion.discount
      }
      //保存总金额及满减
      this.setData({
        order:res.data,
        sumMoney:sum,
        cutMoney:res.data.promotion.discount
      })
      this.setData({
        order:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }, 

  //去支付
  gotoPay:function(e){
    //调取支付接口进行支付,支付成功后将支付结果交给后台,后台得到支付结果后,跳转到订单详情页
    fetch('pay',{order_id:1},'POST').then(res=>{
      if(res.data.error!=0){
        wx.showModal({
          title:"支付失败! ",
          content:"请重新尝试"
        })
        return
      }else{
        wx.showModal({
          title:"支付成功",
          icon:"suceess",
          duration:2000,
          success:()=>{
            wx.navigateTo({
              url:'../detail/detail?order_id='+res.data.order_id
            })
          }
        })
      }
    })
  }
})