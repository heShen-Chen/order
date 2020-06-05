//封装网络请求
module.exports = function (path, data, method) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:8081/api/food/'+path, //接口地址
      //url: 'http://192.168.137.202:8081/api/food/'+path, //接口地址
      method: method, 
      data: data,
      header: {
        'Content-Type': 'json'
      },
      success: resolve,
      fail: function () {
        //请求失败执行fail操作
        reject(
          wx.showModal({
            showModal: false,
            title: '失败'
          })
        )
      }
    })
  })
}