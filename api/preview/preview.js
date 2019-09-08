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