import axios from '../../common/axios/config.js';

/**
 * 前概念老师报告信息
 */
export function analyze(klassPreconQueId) {
  return axios.get(`/precon/que/${klassPreconQueId}/analyze`);
}
/**
 * 前概念分组信息
 */
export function groupInfo(klassPreconQueId){
  return axios.get(`/group/preque/${klassPreconQueId}`);
}

/**
 * 设置正确观点
 */
export function setPoint(klassPreconQueId,index){
  return axios.post(`/group/preque/right/${klassPreconQueId}/${index}`);
}

/**
 * 移动分组
 */
export function move(workId, dir){
  return axios.put(`/group/preque/move/${workId}`,{
    dir: dir
  });
}

/**
 * 批量移动观点
 */
export function moveToIndex(klassPreconQueId, index, workIds){
  return axios.post(`/group/preque/move/${klassPreconQueId}/${index}`,{workIds: workIds});
}

/**
 * 设置分组信息策略等信息
 */
export function updateGroupInfo(klassPreconQueId, uwg){
  return axios.post(`/group/preque/${klassPreconQueId}/info`, uwg);
}
