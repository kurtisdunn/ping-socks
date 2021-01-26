import fetch from '../../utils/fetch';

export default function (data) {
  console.log('tags.get');
  return fetch('/api/tags');
}
