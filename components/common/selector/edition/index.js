import API from '../../../../api/index.js';

Component({
  properties: {
    sbjId: {
      type: Number
    },
    stgId: {
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

  ready() {
    this.getEdition(this.properties.sbjId, this.properties.stgId);
  },

  methods: {
    /**
     * 查询教材版本
     */
    getEdition(sbjId, stgId) {
      API.Question.getEdition(sbjId, stgId).then((rep) => {
        this.setData({
          edition: rep
        });
      });
    },

    /**
     * 选择教材版本
     */
    handleSelectEdition(ev) {
      var editid = ev.target.dataset.edtid;
      var edtName = ev.target.dataset.edtname;
      this.setData({
        selectedEdtId: editid
      });
      this.setData({
        selectedEdtName: edtName
      });
      this.getRelativeBook(editid);
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
    }
  }
})
