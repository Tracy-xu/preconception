import axios from '../../common/axios/config.js';

export function getStudentById(studentId) {
  return axios.get(`/qgn/svc/student/${studentId}`)
}

export function getAllSubject() {
  return axios.get(`/qgn/subject`)
}

export function getWorkList(data) {
  return axios.get("/qgn/precon/que/work",{
    params:data,
  })
}

export function getWorkListByklassPreconQueId(klassPreconQueId ) {
  return axios.get(`/qgn/precon/que/${klassPreconQueId}/work`)
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