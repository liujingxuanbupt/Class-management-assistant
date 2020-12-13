Page({
  data: {
    userInfo:"",//设置测试参数
    classNum:"",
    hiddenmodalput:true,
    classNumber:"暂未加入班级"
  },
onLoad:function(option){
    var that = this
    wx.getStorage({//获取本地缓存
      key:"userInfo",
      success:function(res){
        that.setData({
          userInfo:res.data
        });
      }
    })
    wx.request({
      url: 'http://www.biupiti.cn/specific_class?yourName='+that.data.userInfo,
      success:function(res){
        console.log(res)
        that.setData({
          classNumber : res.data[0].classNumber,
          classNum : res.data[0].classNumber
        })
      }
    })
  },
modalinput:function(){  
    this.setData({  
       hiddenmodalput: !this.data.hiddenmodalput  
    })  
},  
input:function(e){
  var temp = e.detail.value
  var that = this
    that.setData({
      classNum:temp
    })
  },
cancel: function(){  
    this.setData({  
        hiddenmodalput: true  
    });  
},
confirm: function(){  
  this.setData({  
      hiddenmodalput: true  
  })
  var that = this
  wx.request({
    url: 'http://www.biupiti.cn/student_get?classNumber='+this.data.classNum+'&yourName='+this.data.userInfo,
    success: function (res) {
      console.log(res.data)
      that.setData({
        classNumber:that.data.classNum
      })
    
    }
  })  
},
goSetting:function(){
  wx.navigateTo({
    url: '../setting/setting',
  })
} ,
goRecord:function(){
  wx.navigateTo({
    url: '../record/record',
  })
} 
})