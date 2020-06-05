// pages/list/list.js
const fetch=require('../../utils/fetch')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      listData:[],
      activeIndex:0,
      loading:true,   //页面数据是否加载成功
      sumMoney:0,  //购物车的总金额
      carNumber:0, //购物车商品的总数量
      currentType:0,  //当前的菜单的索引
      currentIndex:0,   //当前菜单下单品的索引
      carList:[] ,       //购物车数据列表
      showCar:null,   //是否显示购物车列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通过网络访问得到数据  
    wx.showLoading({
      title: '正在加载...',
    })
    fetch('list').then(res=>{
      wx.hideLoading()
      this.setData({
        listData:res.data
      })
    })
  },
  selectMenu:function(e){
      //获取被选中的数据项下标
      let index=e.currentTarget.dataset.index
      //记录被选中的下标
      this.setData({
        activeIndex:index
      })

  },
  //添加商品到购物车
  addToCart:function(e){
    //记录当前添加的商品菜单索引及单品索引
    this.setData({
      currentType:e.currentTarget.dataset.type,
      currentIndex:e.currentTarget.dataset.index,
    })
    var d =this.data 
    //生成一个订单项,包含:单品名称、数量、单价、小计（单价*数量）
    var addItem={
      "name":d.listData[d.currentType].foods[d.currentIndex].name,
      "number":1,
      "price":d.listData[d.currentType].foods[d.currentIndex].specfoods[0].price,
      "sum":d.listData[d.currentType].foods[d.currentIndex].specfoods[0].price,
      "detail":d.listData[d.currentType].foods[d.currentIndex].specfoods[0].specs[0].name+":"
      +d.listData[d.currentType].foods[d.currentIndex].specfoods[0].specs[0].value
    }
    //将订单项加入到购物车数据列表
    var cl=this.data.carList
    //判断购物车内是否已有该单品,如有则数量加1 ,否则将item添加到购物车
    var find=false;
    cl.length
    for(var i=0;i<cl.length;i++){
        if(cl[i].name==addItem.name){
          find=true;
          //修改购物车中的单品数量 (+1)
          cl[i].number= cl[i].number+1
          //修改小计
          cl[i].sum=cl[i].sum + addItem.price
          break;
        }
    }
    //如果未找到,说明购物车无此单品,需要添加该单品,否则改变其数量即可
    if(!find){
      cl.push(addItem)
    }
    // 修改总金额
    var sm=this.data.sumMoney
    sm =sm +addItem.price
    //修改商品总数量
    var snum= this.data.carNumber +1
    //更新数据到data
    this.setData({
      carList:cl,
      sumMoney:sm,
      carNumber:snum
    })
  },
  //显示购物车列表
  showCarList:function(){
    if(this.data.carList.length>0){
      this.setData({
        showCar:!this.data.showCar
      })
    }
  },
  //增加购物车中单品的数量
  addNumber:function(e){
    //获取单品在购物车中的索引
    var index=e.currentTarget.dataset.index;
    //获取购物车列表数据
    var cl=this.data.carList
    //修改购物车中的单品的数量及小计,购物车总金额
    //数量加1
    cl[index].number++
    //修改小计
    cl[index].sum=cl[index].sum +cl[index].price
    //修改购物车中商品的总数量
    var cn=this.data.carNumber
    cn++
    //修改购物车总金额
    var sm=this.data.sumMoney
    sm=sm+cl[index].price
    //更新数据
    this.setData({
      carList:cl,
      carNumber:cn,
      sumMoney:sm
    })
  },
   //减少购物车中单品的数量
  decNumber:function(e){
    //获取单品在购物车中的索引
    var index=e.currentTarget.dataset.index;
    //获取购物车列表数据
    var cl=this.data.carList

    //修改购物车中商品的总数量
    var cn=this.data.carNumber
    //修改购物车总金额
    var sm=this.data.sumMoney
    //修改总数量
    cn--
    //修改总金额
       sm=sm-cl[index].price
    //减少商品数量,小计,总金额,总数量
    //如果当前商品数量大于1,则减少,否则在购物车中删除该商品
    var currentNum=cl[index].number
    if(currentNum>1){
      //修改数量,小计,总金额,总数量
      //数量减1
      cl[index].number--
      //修改小计
      cl[index].sum=cl[index].sum -cl[index].price
    }else{
      //修改总数量与总金额
      //删除购物车中的该单品,删除购物车中第index个单品
      cl.splice(index,1)
    }

   
      //更新数据
      this.setData({
        carList:cl,
        carNumber:cn,
        sumMoney:sm
      })
  },
  //清空购物车
  clearCarList:function(){
    this.setData({
      carList:[],
      showCar:false,
      carNumber:0,
      sumMoney:0
    })
  },
  //选好了功能
  goBalance:function(){
    //向服务器发起生成订单的请求,如果成功则跳转到订单确认页面
    //模拟数据代入,将其存储到本地
    var carData={
      carList:this.data.carList,
      sumMoney:this.data.sumMoney,
      carNumber:this.data.carNumber
    }
    wx.setStorageSync('carData',carData)
    //跳转到订单确认页面
    wx.navigateTo({
      url: '../order/balance/balance?order_id=3',
    })
  }
 
})