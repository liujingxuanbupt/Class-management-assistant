// miniprogram/pages/register/register.js
let app = getApp();
const db = wx.cloud.database();
const admin = db.collection('adminlist');
let name = null;
let password = null;
let number = null;

Page({
  data: {
   
  },
 
  inputName: function (event) {
    name = event.detail.detail.value
  },
  inputPassword(event) {
    password = event.detail.detail.value
  },
  inputNumber(event) {
    number = event.detail.detail.value
  },
  
  register() {
    let that = this;
    let flag = false
    admin.get({
      success: (res) => {
        let admins = res.data; 
         console.log(admins);
        for (let i = 0; i < admins.length; i++) { 
          if (name === admins[i].name) { 
            flag = true;
              break;
          }
        }
        if (flag === true) {    
          wx.showToast({
            title: '账号已注册！',
            icon: 'none',
            duration: 2500
          })
        } else { 
          that.saveUserInfo()
        }
      }
    })
  },
 
  saveUserInfo() {
    let that = this;
    admin.add({  
      data: {
        name: name,
        password: password,
        number: number
      }
    }).then(res => {
      console.log('注册成功！')
      wx.showToast({
        title: '注册成功！',
        icon: 'success',
        duration: 5000
      })
      wx.redirectTo({
        url: '/pages/login/login',
      })
    })
  }
})
