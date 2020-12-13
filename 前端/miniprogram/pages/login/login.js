// pages/login/login.js
let app = getApp();
const db = wx.cloud.database();
const admin = db.collection('adminlist');
let name = null;
let password = null;

Page({


  data: {

  },

  inputName: function (event) {
    name = event.detail.detail.value
  },

  inputPassword(event) {
    password = event.detail.detail.value
  },
 
  login() {
    let that = this;
    admin.get({
      success: (res) => {
        let user = res.data;
        // console.log(res.data);
        for (let i = 0; i < user.length; i++) {  
          if (name === user[i].name) { 
            if (password !== user[i].password) { 
              wx.showToast({
                title: '密码错误！',
                icon: 'none',
                duration: 2500
              })
            } else {
              console.log('登陆成功！')
              wx.showToast({
                title: '登陆成功！',
                icon: 'success',
                duration: 2500
              })
              wx.setStorage({//存储到本地
                key:"userInfo",
                data:name
              })          
              wx.switchTab({
                url: "../index/index",
              })
            }
          } else {   
            wx.showToast({
              title: '无此用户名！',
              icon: 'none',
              duration: 2500
            })
          }
        }
      }
    })
  },
  register() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  }
  })