import fetch from '../../utils/fetch';

export default function (data) {
  return fetch('/ping', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"data": data })
  }).then(r => r);
}
