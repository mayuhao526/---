let mydata = require("../../mydata/data.js")
Page({

  data:{
    playStatus: false,
    playUrl:'../../images/play.png',
    stopUrl:'../../images/stop.png',
    rotateDeg:0,
    playSingUrl:"",
    playSingName:"",
    playSingId:"",
    cTime:"00:00",
    aTime:"00:00",
    allTime:0,
    silderVal:0
  },
  onHide(){
    //页面进入后台时暂停
    this.setData({
      playStatus:false,
    })
    clearInterval(this.timer);
  },

  onLoad(){
    //页面加载进来获取json
    this.changeSing()
  },
  onUnload() {
    // 页面卸载清除计时器
    clearInterval(this.timer);
    
  }, 
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio');
  },

  initStatus(){
    clearInterval(this.timer);
    this.setData({
      playStatus: false,
      cTime:"00:00",
      aTime:"00:00",
      allTime:0,
      silderVal:0
    })
  },


 

  changeSing(){
    //下一首随机歌曲
    this.initStatus();
    let randomDig=Math.floor(Math.random()*mydata.myList.length)
    while(this.data.playSingId==randomDig){
      randomDig=Math.floor(Math.random()*mydata.myList.length)
    }
    this.setData({
      playSingId:randomDig,
      playSingName:mydata.myList[randomDig].singName,
      playSingUrl:mydata.myList[randomDig].singUrl,
    })
    
  },

  

  getTime(t){
    let time = Math.floor(t);
    let min = 0;
    let sec = 0;
    if(time>60){
      min = Math.floor(t/60);
      sec = Math.floor(t%60);
    }else{
      min = 0;
      sec = Math.floor(t);
    }
    if(min<10){
      min = "0"+min;
    }
    if(sec<10){
      sec = "0"+sec;
    }
    return min+":"+sec;
  },

  timeChange(d){
    let that = this;
    this.setData({
      cTime:that.getTime(d.detail.currentTime),
      aTime:that.getTime(d.detail.duration),
      allTime:Math.floor(d.detail.duration)
    })
  },

  sliderChange(event){
    //滑动时长函数
    this.audioCtx.seek(event.detail.value);
  },

  

  //控制面板旋转
  rotates(s){
    let that = this;
    if(s){
      that.timer = setInterval(function(){
        if(that.data.rotateDeg==360){
          that.setData({
            rotateDeg:0
          })
        }
            that.setData({
              rotateDeg:that.data.rotateDeg+1
            })
          },80)
    }else{
      clearInterval(that.timer);
    }
    
  },

  //判断播放还是暂停
  playStop(){
    this.setData({
      playStatus:!this.data.playStatus,
    })
    this.goplay(this.data.playStatus); 
    this.rotates(this.data.playStatus);
    
  },
  
  goplay: function (s) {
    //播放还是暂停
    let that = this;
    if(s){
      console.log("play!");
      that.audioCtx.play();
    }else{
      console.log("pause!");
      that.audioCtx.pause();
    }
  }

  


})