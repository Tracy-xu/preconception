import axios from '../../common/axios/config.js'

export function foo() {
  return axios.get('/');
}

export default {
  foo
}