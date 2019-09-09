import axios from '../../common/axios/config.js';

export function getStudentById(studentId) {
  return axios.get(`/qgn/svc/student/${studentId}`)
}

export function getWorkList(data) {
  console.log(data)
  return axios.get("/qgn/precon/que/work",{
    params:data,
  })
}

export function getWorkById(workId) {
  return axios.get(`/qgn/precon/que/work/${workId}`)
}

export function pushWorkStorage(workId,data) {
  return axios.put(`/qgn/precon/que/work/${workId}/storage`,data)
}

export function pushWorkSave(workId, data) {
  return axios.put(`/qgn/precon/que/work/${workId}/save`, data)
}

export function putAnswerLike(sourceId, targetId) {
  return axios.put(`/qgn/precon/que/work/${sourceId}/like/${targetId}`)
}