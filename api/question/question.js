import axios from '../../common/axios/config.js';

/**
 * 查询所有学段
 */
export function getStage() {
  return axios.get('/qgn/stage');
}

/**
 * 查询关联学段的学科
 */
export function getSubject() {
  return axios.get('/qgn/compositeStages');
}

/**
 * 查询关联学段、学科的教材版本
 */
export function getEdition(sbjId, stgId) {
  return axios.get(`/qgn/compositeEditions?sbjId=${ sbjId }&stgId=${ stgId }`);
}

/**
 * 查询章节树
 */
export function getChapterTree(tbkId) {
  return axios.get(`/qgn/textbook/${tbkId }/tree`);
}

/**
 * 查询前概念习题
 */
export function getQuestion(param) {
  return axios.get(`/qgn/precon/que?${param }`);
}

/**
 * 查询习题详情
 */
export function getQuestionDetail(resId, refId) {
  return axios.get(`/qgn/precon/que/${ resId }/${ refId }`);
}

/**
 * 创建习题
 */
export function createQuestion(action, param, resId='', refId='') {
  return axios.post(`/qgn/precon/que?intent=${ action }&scope=1&resId=${ resId }&refId=${ refId }`, param);
}

/**
 * 批量创建
 */
export function createQuestionBulk(action, param, resId = '', refId = '') {
  return axios.post(`qgn/precon/que/bulk?intent=${ action }&scope=1&resId=${ resId }&refId=${ refId }`, param);
}

/**
 * 删除习题
 */
export function deleteQuextion(resId) {
  return axios.delete(`qgn/resource/${ resId }`);
}

/**
 * 绑定班级
 */
export function bindClass(param) {
  return axios.post('/qgn/klass/precon/que/bind', param);
}

/**
 * 批量绑定
 */
export function bindClassBulk(param) {
  return axios.post('/qgn/klass/precon/que/bulk/bind', param);
}

/**
 * 解除绑定班级
 */
export function unbindClass(param) {
  return axios.post('/qgn/klass/precon/que/unbind', param);
}

/**
 * 查询习题所绑定班级
 */
export function getBindClass(resId) {
  return axios.get(`/qgn/klass/precon/que/${resId }/info`);
}