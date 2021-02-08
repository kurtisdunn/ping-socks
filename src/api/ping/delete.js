import fetch from '../../utils/fetch';

export default function (data) {
  console.log(data);
  return fetch('/ping', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'id': data })
  }).then(r => r);
}
