// miniprogram/pages/userSelect/userSelect.js
Page({
  data: {
      userInfo:"admin",
      classNumber:"",
      student:[],
      current: []
  },
  onLoad:function(option){
    var that = this
    wx.getStorage({//获取本地缓存
      key:"class",
      success:function(res){
        that.setData({
          classNumber:res.data
        });
      }
    })
    wx.request({
      url: 'http://www.biupiti.cn/specific_student?classNumber='+this.data.classNumber,
      success:(res)=>{
        console.log(res)
        this.setData({
          student:res.data
        })
        console.log(this.data.student)
      }
    })
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      current:this.data.current
    })
  },
  handleChange({ detail = {} }) {
    const index = this.data.current.indexOf(detail.value);
    index === -1 ? this.data.current.push(detail.value) : this.data.current.splice(index, 1);
    this.setData({
        current: this.data.current
    });
    console.log(this.data.current)
},
  userSelect(){
    wx.navigateBack({
      delta:1
    })}
})