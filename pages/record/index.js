Page({
  data:{
      date:"2016-10-4",
  },
  onReady(){

  },
  bindDateChange(e){
    this.setData({
      date: e.detail.value
    })
  },
})