import router from '../../../router/index.js';
import API from '../../../api/index.js';
import qs from '../../../utils/qs/index.js';

const app = getApp();

Page({
  data: {
    show: false,
    
    // 偏好
    preference: {},

    // 用户信息
    userInfo: {},

    // 当前班级
    selectedKlassName: '',
    
    // 查询条件
    queryParam: {
      curPage: 1,
      klassId: null,
      schoolId: null,
    },
    
    // 查询结果
    reports: null,
  },

  onLoad: async function(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      selectedKlassName: app.globalData.userInfo.klasses[0].name,
      queryParam: Object.assign({}, this.data.queryParam, {
        klassId: app.globalData.userInfo.klasses[0].id,
        schoolId: app.globalData.userInfo.school.id,
      }),
    });

    const rep = await this.getAssignHistory(this.data.queryParam);
    
    this.setData({
      reports: rep
    });

    var res = await this.getTbkPreference();

    this.data.preference.stgId = res.stgId;
    this.data.preference.sbjId = res.sbjId;
    this.data.preference.edtId = res.edtId;
    this.data.preference.tbkId = res.tbkId;

    var edtName = '';
    var tbkName = '';
    var nodeName = '';
    var path = [];
    var tbkNodes = res.tbkNode;
    var tbkNodeId = null;
    if (tbkNodes) {
      edtName = tbkNodes[0].attrs.edtName;
      tbkName = tbkNodes[0].attrs.tbkName;
      var hasPath = tbkNodes[0].path;
      if (hasPath) {
        path = tbkNodes[0].path;
        tbkNodeId = path[path.length - 1].id;
        nodeName = path[path.length - 1].name;
      }
    }

    this.data.preference.edtName = edtName;
    this.data.preference.tbkName = tbkName;
    this.data.preference.nodeName = nodeName;
    this.data.preference.tbkNodeId = tbkNodeId;
    this.data.preference.path = path;

    this.setData({
      preference: this.data.preference,
    });
  },

  /**
   * 获取数据偏好
   */
  getTbkPreference() {
    return API.Question.getTbkPreference();
  },

  /**
   * 分页查询老师历史纪录
   */
  handlePageChange() {
    var curPage = this.data.queryParam.curPage + 1;
    var totalPage = Math.ceil(this.data.reports.page.total / this.data.reports.page.pageSize);

    if (curPage > totalPage) {
      curPage = totalPage;

      this.setData({
        pageTips: '没有更多数据'
      });

      return;
    }

    this.setData({
      pageTips: '加载中'
    });

    this.setData({
      queryParam: Object.assign({}, this.data.queryParam, {
        curPage: curPage
      })
    });

    this.getAssignHistory(this.data.queryParam).then((rep) => {
      var items = this.data.reports.items.concat(rep.items);
      var page = rep.page;
      this.data.reports.items = items;
      this.data.reports.page = page;

      this.setData({
        reports: this.data.reports
      });
    });
  },

  /**
   * 获取老师历史纪录
   */
  getAssignHistory(param) {
    return API.Analysis.assignHistory(qs(param));
  },

  /**
   * 打开筛选班级弹框
   */
  handleShowActionSheet() {
    var itemList = this.data.userInfo.klasses.map((item) => {
      return item.name;
    });

    wx.showActionSheet({
      itemList: itemList,
      success: async (res) => {
        this.setData({
          selectedKlassName: itemList[res.tapIndex],
          queryParam: Object.assign({}, this.data.queryParam, {
            curPage: 1,
            klassId: app.globalData.userInfo.klasses[res.tapIndex].id,
          }),
        });

        const rep = await this.getAssignHistory(this.data.queryParam);

        this.setData({
          reports: rep
        });
      },
    })
  },

  /**
   * 打开报告详情
   */
  handleOpenReportDetail: function(ev) {
    var report = ev.currentTarget.dataset.report;
    var commit = report.commit;
    var klassPreconQueId = report.klassPreconQue.klassPreconQueId;

    if (!commit){
      wx.showToast({
        title: '当前还没有学生提交，暂时不能查看报告详情',
        icon: 'none',
      });
      return;
    }
    wx.navigateTo({
      url: `${router.analysisDetail}?klassPreconQueId=${klassPreconQueId}`
    });
  },

  /**
   * 切换全文显示
   */
  handleToggleMore: function(){
    this.setData({
      show: !this.data.show
    });
  },

  /**
   * 创建习题
   */
  handleCreatQuestion() {
    var stgId = this.data.preference.stgId;
    var sbjId = this.data.preference.sbjId;
    var edtId = this.data.preference.edtId;
    var tbkId = this.data.preference.tbkId;
    var tbkNodeId = this.data.preference.tbkNodeId;

    var nodeName = this.data.preference.nodeName;
    var edtName = this.data.preference.edtName;
    var tbkName = this.data.preference.tbkName;
    var path = JSON.stringify(this.data.preference.path);

    wx.navigateTo({
      url: `${router.questionCreate}?stgId=${stgId}&sbjId=${sbjId}&edtId=${edtId}&tbkId=${tbkId}&tbkNodeId=${tbkNodeId}&nodeName=${nodeName}&edtName=${edtName}&tbkName=${tbkName}&path=${path}`
    });
  },

  /**
   * 速查手册
   */
  handleOpenHandbook() {
    var stgId = this.data.preference.stgId;
    var sbjId = this.data.preference.sbjId;
    var edtId = this.data.preference.edtId;
    var tbkId = this.data.preference.tbkId;
    var tbkNodeId = this.data.preference.tbkNodeId;

    var nodeName = this.data.preference.nodeName;
    var edtName = this.data.preference.edtName;
    var tbkName = this.data.preference.tbkName;
    var path = JSON.stringify(this.data.preference.path);

    wx.navigateTo({
      url: `${router.handBook}?stgId=${stgId}&sbjId=${sbjId}&edtId=${edtId}&tbkId=${tbkId}&tbkNodeId=${tbkNodeId}&nodeName=${nodeName}&edtName=${edtName}&tbkName=${tbkName}&path=${path}`
    });
  },

  /**
   * 切换 tabbar
   */
  handleTabChange(data) {
    const index = data.detail.index;
    if (index === 1) {
      wx.redirectTo({
        url: router.profile
      });
    }
  },
})