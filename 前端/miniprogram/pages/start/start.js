// miniprogram/pages/start/start.js
Page({
  login:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  register:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  }
})