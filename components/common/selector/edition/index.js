import API from '../../../../api/index.js';

Component({
  properties: {
    sbjId: {
      type: Number
    },
    stgId: {
      type: Number
    },
    edtId: {
      type: Number
    },
    tbkId: {
      type: Number
    }
  },

  data: {
    edition: [],
    selectedEdtId: null,
    selectedEdtName: '',
    relativeBook: [],
    selectedTbkId: null
  },

  async ready() {
    await this.getEdition(this.properties.sbjId, this.properties.stgId);

    if (this.properties.edtId && this.properties.tbkId) {
      this.setDefaultSelect(this.properties.edtId, this.properties.tbkId);
    }
  },

  methods: {
    /**
     * 查询教材版本
     */
    getEdition(sbjId, stgId) {
      return API.Question.getEdition(sbjId, stgId).then((rep) => {
        this.setData({
          edition: rep
        });
      });
    },

    /**
     * 选择教材版本
     */
    handleSelectEdition(ev) {
      var edtId = ev.target.dataset.edtid;
      var edtName = ev.target.dataset.edtname;
      this.setData({
        selectedEdtId: edtId
      });
      this.setData({
        selectedEdtName: edtName
      });
      this.getRelativeBook(edtId);
    },

    /**
     * 获取关联课本
     */
    getRelativeBook(edtId) {
      this.data.edition.forEach((item) => {
          if (item.edtId === edtId) {
            this.setData({
              relativeBook: item.books
            });
          }
      });
    },

    /**
     * 选择课本
     */
    handleSelectBook(ev) {
      var tbkId = ev.target.dataset.tbkid;
      var tbkName = ev.target.dataset.tbkname;
      var edtId = this.data.selectedEdtId;
      var edtName = this.data.selectedEdtName;
      this.setData({
        selectedTbkId: tbkId
      });
      this.triggerEvent('selectbook', { edtName, edtId, tbkName, tbkId });
    },

    /**
     * 设置默认选中
     */
    setDefaultSelect(edtId, tbkId) {
      this.setData({
        selectedEdtId: edtId,
        selectedTbkId: tbkId
      });

      this.getRelativeBook(edtId);
    }
  }
})
