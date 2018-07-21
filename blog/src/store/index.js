import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    flag: false,
    follow: [],
    articleList: [],
    articleTypeList: ['OS', '前端', '后台', '数据库', '计算机网络'],
    title: $('title'),
    user: { image: 'image/default.png'},
    api: 'http://' + location.hostname + ':8080/'
  },
  mutations: {
    setArticleTypeList(state, list) {
      state.articleTypeList = list;
    },
    setTitle(state, title) {
      if(state.title.text() != title) {
        state.title.text(title);
      }
    },
    updateUserFollow(state, follow) {
      state.user.follow = follow;
    }
  },
  getters: {
    getApi: ({ api }) => (path = '') => {
      return api + path;
    },
    getUser({ user }) {
      return user;
    },
    isLogin({ flag }) {
      return flag;
    },
    getArticleTypeList({ articleTypeList }) {
      return articleTypeList;
    }
  },
  actions: {
    getUserInformation({ state, getters }) {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'get',
          url: getters.getApi('login'),
          xhrFields: {withCredentials: true},
          success: (json) => {
            if(state.flag = json.flag) {
              state.user = json.userInformation;
              resolve(json);
            }else {
              reject(json.reason);
            }
          }
        });
      });
    }
  }
});