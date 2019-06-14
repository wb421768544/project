import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://' + location.hostname + ':8080/';

axios.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (err) => {
    return Promise.reject(err);
  },
);




export const fetchArticle = (id) => axios
  .get('/article', {
    params: {
      id,
    }
  })
  .then(res => Promise.resolve(res));

export const fetchStar = ({ num, name, articleId }) => axios
  .get('/api', {
    params: {
      num,
      name,
      require: 'updatestar',
      article_id: articleId,
    },
  })
  .then(res => res.data);
