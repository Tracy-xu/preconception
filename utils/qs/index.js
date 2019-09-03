export default function query(json) {
  return Object.keys(json).map(k => `${k}=${json[k]}`).join('&');
}