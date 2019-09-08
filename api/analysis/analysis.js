import axios from '../../common/axios/config.js';

export function analyze(klassPreconQueId) {
  return axios.get(`/precon/que/${klassPreconQueId}/analyze`);
}