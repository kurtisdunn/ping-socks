import fetch from '../../utils/fetch';

export default function (data) {
  console.log('portfolio.get');
  return fetch('/api/portfolio');
}
