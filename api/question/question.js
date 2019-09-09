import axios from '../../common/axios/config.js';

export function getQuestions() {
  return axios.get('qgn/precon/que');
}