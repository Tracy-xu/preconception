export default function query(json) {
  var arr = [];
  Object.keys(json).forEach((key) => {
    if (json[key]) {
      arr.push(`${ key }=${ json[key] }`);
    }
  })
  
  return arr.join('&');
}