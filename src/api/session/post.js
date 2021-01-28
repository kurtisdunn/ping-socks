import fetch from '../../utils/fetch';

export default function (data) {
  return fetch('/api/session', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(r => r);
}
