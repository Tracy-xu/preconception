// pages/analysis/analysis-detail/index.js
import API from '../../../api/analysis/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check: true,
    imgshow: false,
    progress: 50,
    commentDialog: false,
    currIndex: null,
    currLabel: null,
    currComment: null,
    commentbtns: [{ text: '取消' }, { text: '确定'}],
    pointbtns: [{ text: '取消' }, { text: '确定' }],
    moveIds: [], // 需要移动的分组ID
    selectedWorkIds: {},
    quanwenWorkIds: {},
    openPoint: false,
    currPointIndex: -1,
    visibleVideo: false,
    urlVideo: '',
    openGroupInfo: [{ open: true, text: '收起' }, { open: true, text: '收起' }, { open: true, text: '收起' },
      { open: true, text: '收起' }, { open: true, text: '收起' }, { open: true, text: '收起' }], //展开状态的分组
    klassPreconQueId: null,
    workGroup: {
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      klassPreconQueId: options.klassPreconQueId || 16
    });
    this.doLoad();
  },
  doLoad(){
    API.Analysis.groupInfo(this.data.klassPreconQueId).then(res => {
      this.setData({
        workGroup: res
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  /**
   * 设置正确观点
   */
  setPoint(index) {
    API.Analysis.setPoint(this.data.klassPreconQueId, index).then(res => {
      wx.showToast({
        title: '移动成功',
        icon: 'success',
        duration: 2000
      })
    });
  },
  moveUp(event) {
    this.move(event.currentTarget.dataset.workId, 'UP');
  },
  moveDown(event) {
    this.move(event.currentTarget.dataset.workId, 'DOWN');
  },
  moveTop(event) {
    this.move(event.currentTarget.dataset.workId, 'TOP');
  },
  moveBottom(event) {
    this.move(event.currentTarget.dataset.workId, 'BOTTOM')
  },
  /**
   * 移动分组
   */
  move(workId, dir) {
    API.Analysis.move(workId, dir).then(res => {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      });
      this.doLoad();
    });
  },
  // 批量设置workIds
  updateMoveIds(event){
    let workId = event.currentTarget.dataset.workId;
    let index = this.data.moveIds.indexOf(workId);
    if (index != -1){
      // 删除
      this.data.moveIds.splice(index,1);
    }else{
      // 增加
      this.data.moveIds.push(workId);
    }
    this.setData({
      moveIds: this.data.moveIds
    })
  },
  /**
   * 批量移动分组
   */
  bulkMoveGroup(event) {
    let gIdx = event.currentTarget.dataset.gIdx;
    let workIds = [];
    for (var key in this.data.selectedWorkIds){
      workIds.push(key);
    }
    if (!workIds.length) {
      wx.showToast({
        title: '请选择移动对象',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    console.log(workIds);
    API.Analysis.moveToIndex(this.data.klassPreconQueId, gIdx, workIds).then(res => {
      this.doLoad();
      this.setData({ selectedWorkIds: {}});
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      });
    });
  },
  /**
   * 设置策略
   */
  showCommentDialog(event){
    let dataset = event.currentTarget.dataset;
    this.setData({
      currIndex: dataset.index,
      currLabel: dataset.label,
      currComment: dataset.comment || '',
      commentDialog: !this.data.commentDialog
    })
  },
  bindCurrCommentInput(event){
    this.setData({
      currComment: event.detail.value
    })
  },
  bindCommentConfirm(event) {
    this.setData({
      commentDialog: !this.data.commentDialog
    })
    let dataset = event.currentTarget.dataset;
    if (event.detail.index == 1) {
      //确认
      let uwg = {
        label: this.data.currLabel,
        comment: this.data.currComment,
        index: this.data.currIndex
      };
      this.data.workGroup.groups[uwg.index].groupInfo.comment = uwg.comment;
      this.setData({
        workGroup: this.data.workGroup
      });
      this.doUpdateGroupInfo(uwg);
    } else {
      //取消
    }
  },
  updateLabe(event){
    debugger
    let dataset = event.currentTarget.dataset;
    let uwg = {
      label: dataset.label,
      comment: dataset.comment || '',
      index: dataset.index
    }
    this.data.workGroup.groups[uwg.index].groupInfo.label = uwg.label;
    this.setData({
      workGroup: this.data.workGroup
    });
    this.doUpdateGroupInfo(uwg);
  },
  doUpdateGroupInfo(uwg){
    API.Analysis.updateGroupInfo(this.data.klassPreconQueId, uwg).then(res => {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      })
    });
  },
  /**
   * 打开或者关闭分组
   */
  openGroup(event){
    let gIdx = event.currentTarget.dataset.gIdx;
    if (this.data.openGroupInfo[gIdx].open){
      this.data.openGroupInfo[gIdx].open = false;
      this.data.openGroupInfo[gIdx].text = '展开';
    }else{
      this.data.openGroupInfo[gIdx].open = true;
      this.data.openGroupInfo[gIdx].text = '收起';
    }
    this.setData({
      openGroupInfo: this.data.openGroupInfo
    })
  },
  // 选中作业 后进行批量移动分组
  selectedWork(event){
    let workId = event.currentTarget.dataset.workId;
    this.data.selectedWorkIds[workId] = !this.data.selectedWorkIds[workId];
    this.setData({
      selectedWorkIds: this.data.selectedWorkIds
    });
  },
    bindPointConfirm(event) {
    this.setData({
      openPoint: !this.data.openPoint
    })
    let dataset = event.currentTarget.dataset;
    if (event.detail.index == 1) {
      //确认
      API.Analysis.setPoint(this.data.klassPreconQueId, this.data.currPointIndex).then(res=>{
        this.doLoad();
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        });
      });
    } else {
      //取消
    }
  },
  bindCurrPointIndex(event) {
    let pointIndex = event.currentTarget.dataset.pointIndex;
    this.setData({ currPointIndex: pointIndex });
  },
  // 设置正确观点
  openPoint() {
    this.setData({ openPoint: !this.data.openPoint, currPointIndex: 0 });
  },
  /**
   * 全文
   */
  openQuanwen(event){
    let workId = event.currentTarget.dataset.workId;
    this.data.quanwenWorkIds[workId] = !this.data.quanwenWorkIds[workId];
    this.setData({
      quanwenWorkIds: this.data.quanwenWorkIds
    })
  },
  handleCloseVideo(event){
    this.setData({
      visibleVideo: false
    });
  },
  openVideo(event){
    let urlVideo = event.currentTarget.dataset.urlVideo;
    this.setData({
      urlVideo: urlVideo,
      visibleVideo: true,
    });
  },
  openImgs(event){
    let imgs = event.currentTarget.dataset.imgs;
    wx.previewImage({
      urls: imgs,
    })
  }
})