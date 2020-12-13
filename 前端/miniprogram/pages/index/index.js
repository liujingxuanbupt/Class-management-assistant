const util2 = require('../../utils/util2.js')
const defaultLogName = {
  work: '工作',
  rest: '休息'
}
const actionName = {
  stop: '停止',
  start: '开始'
}

const initDeg = {
  left: 45,
  right: -45,
}

Page({

  data: {
    remainTimeText: '',
    timerType: 'work',
    log: {},
    completed: false,
    isRuning: false,
    leftDeg: initDeg.left,
    rightDeg: initDeg.right,
    userInfo:"",
    noticeNum:"0",
    classNumber:""
  },
  onLoad: function (options) {
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
      url: 'http://www.biupiti.cn/imforamtion_check?target='+this.data.userInfo,
      success:(res)=>{
        console.log(res)
        this.setData({
          noticeNum:res.data.length
        })
        console.log(this.data.noticeNum)
      }
    })
  },
  onShow: function() {
    wx.request({
      url: 'http://www.biupiti.cn/specific_class?yourName='+this.data.userInfo,
      success:(res)=>{
        this.setData({
          classNumber : res.data[0].classNumber,
        })
        console.log(this.data.classNumber)
      }
    })
    if (this.data.isRuning) return
    let workTime = util2.formatTime(wx.getStorageSync('workTime'), 'HH')
    let restTime = util2.formatTime(wx.getStorageSync('restTime'), 'HH')
    this.setData({
      workTime: workTime,
      restTime: restTime,
      remainTimeText: workTime + ':00'
    })
  },

  startTimer: function(e) {
    let startTime = Date.now()
    let isRuning = this.data.isRuning
    let timerType = e.target.dataset.type
    let showTime = this.data[timerType + 'Time']
    let keepTime = showTime * 60 * 1000
    let logName = this.logName || defaultLogName[timerType]

    if (!isRuning) {
      this.timer = setInterval((function() {
        this.updateTimer()
        this.startNameAnimation()
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }

    this.setData({
      isRuning: !isRuning,
      completed: false,
      timerType: timerType,
      remainTimeText: showTime + ':00',
      taskName: logName
    })

    this.data.log = {
      name: logName,
      startTime: Date.now(),
      keepTime: keepTime,
      endTime: keepTime + startTime,
      action: actionName[isRuning ? 'stop' : 'start'],
      type: timerType
    }
    wx.request({
      url: 'http://www.biupiti.cn/number_check?userInfo='+this.data.userInfo+'&action='+this.data.log.action+'&type='+this.data.log.type,
      success:(res)=>{
        console.log(res)
      }
    })

    this.saveLog(this.data.log)
  },

  startNameAnimation: function() {
    let animation = wx.createAnimation({
      duration: 450
    })
    animation.opacity(0.2).step()
    animation.opacity(1).step()
    this.setData({
      nameAnimation: animation.export()
    })
  },

  stopTimer: function() {
    // reset circle progress
    this.setData({
      leftDeg: initDeg.left,
      rightDeg: initDeg.right
    })

    // clear timer
    this.timer && clearInterval(this.timer)
  },

  updateTimer: function() {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)
    let H = util2.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
    let M = util2.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util2.formatTime(Math.floor(remainingTime) % 60, 'SS')
    let halfTime

    // update text
    if (remainingTime > 0) {
      let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true
      })
      this.stopTimer()
      return
    }

    // update circle progress
    halfTime = log.keepTime / 2
    if ((remainingTime * 1000) > halfTime) {
      this.setData({
        leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
      })
    } else {
      this.setData({
        leftDeg: -135
      })
      this.setData({
        rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
      })
    }
  },

  changeLogName: function(e) {
    this.logName = e.detail.value
  },

  saveLog: function(log) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(log)
    wx.setStorageSync('logs', logs)
  }
})
