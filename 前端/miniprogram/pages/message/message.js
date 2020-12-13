var util = require('../../utils/util.js')
Page({
  data: {
      currentData : 0,
      userInfo:"admin",
      classNumber:"",
      blank:" ",
      items: [
        { name: 'urgent', value: '紧急' },
        { name: 'ordinary', value: '普通', checked: 'true' },
      ],
      current:'',
      notice:"",
      workNum:"undefined",
      restNum:"undefined"
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
      url: 'http://www.biupiti.cn/specific_class?yourName='+this.data.userInfo,
      success:(res)=>{
        this.setData({
          classNumber : res.data[0].classNumber,
        })
        wx.setStorage({//存储到本地
          key:"class",
          data:res.data[0].classNumber
        })       
        console.log(this.data.classNumber)
      }
    })
  },
  onShow: function () {
    var that = this
    wx.request({
      url: 'http://www.biupiti.cn/imforamtion_check?target='+this.data.userInfo,
      success:(res)=>{
        var temp = res.data
        this.setData({
          notice:temp.reverse()
        })
        
      }
    })
    wx.request({
      url: 'http://www.biupiti.cn/studentNumbersrest_get?classNumber='+this.data.classNumber,
      success:(res)=>{
        console.log(res)
        this.setData({
          restNum:res.data
        })
        
      }
    })
    wx.request({
      url: 'http://www.biupiti.cn/studentNumberswork_get?classNumber='+this.data.classNumber,
      success:(res)=>{
        console.log(res)
        this.setData({
          workNum:res.data
        })
        
      }
    })
  },

  //获取当前滑块的index
  bindchange:function(e){
    const that  = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent:function(e){
    const that = this;

    if (that.data.currentData === e.target.dataset.current){
        return false;
    }else{

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  formSubmit:function(e){
    var time=util.formatTime(new Date());
    this.setData({
      time:time
    });
    var title={},userInfo={},time={},content={},target={};
    title.value = e.detail.value.title;
    content.value = e.detail.value.content;
    userInfo.value = this.data.userInfo;
    time.value = this.data.time;
    target.value = this.data.current
    wx.request({
      url: 'http://www.biupiti.cn/imforamtion_get?title='+title.value+'&content='+content.value+'&userInfo='+userInfo.value+'&time='+time.value+'&target='+target.value,
      success:()=>{
        this.setData({
          blank:""
        })
        wx.showToast({
          title: '发布成功！',
          icon: 'success',
          duration: 2500
        })
      }
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  userSelect(){
    wx.navigateTo({
      url:'../userSelect/userSelect',
    })
  }

})