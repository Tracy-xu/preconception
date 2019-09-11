import axios from '../../common/axios/config.js';

/**
 * 查询所有学段
 */
export function getStage() {
  return axios.get('/qgn/stage');
}

/**
 * 查询关联学段的学科信息
 */
export function getSubject() {
  return axios.get('/qgn/compositeStages');
}