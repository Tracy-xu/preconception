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
 * 创建习题
 */
export function createQuestion(param) {
  return axios.post('/qgn/precon/que?intent=ADD&scope=1', {
    data: param
  });
}