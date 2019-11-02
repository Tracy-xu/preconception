import axios from '../../common/axios/config.js';

var baseDir = '/qgn/';

/**
 * 前概念老师单条报告信息
 */
export function analyze(klassPreconQueId) {
  return axios.get(baseDir + `klass/precon/que/${klassPreconQueId}/analyze`);
}

/**
 * 老师历史纪录
 */
export function assignHistory(param) {
  return axios.get(baseDir + `klass/precon/que/analyze?${param}`);
}

/**
 * 前概念分组信息
 */
export function groupInfo(klassPreconQueId){
  return axios.get(baseDir + `group/preque/${klassPreconQueId}`);
}

/**
 * 设置正确观点
 */
export function setPoint(klassPreconQueId,index){
  return axios.post(baseDir + `group/preque/right/${klassPreconQueId}/${index}`);
}

/**
 * 移动分组
 */
export function move(workId, dir){
  return axios.put(baseDir + `group/preque/move/${workId}?dir=${dir}`);
}

/**
 * 批量移动观点
 */
export function moveToIndex(klassPreconQueId, index, workIds){
  return axios.post(baseDir + `group/preque/move/${klassPreconQueId}/${index}`, workIds);
}

/**
 * 设置分组信息策略等信息
 */
export function updateGroupInfo(klassPreconQueId, uwg){
  return axios.put(baseDir + `group/preque/${klassPreconQueId}/info`, uwg);
}
