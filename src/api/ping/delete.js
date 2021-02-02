import fetch from '../../utils/fetch';

export default function (data) {
  return fetch('/api/ping', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'id': data})
  }).then(r => r);
}
