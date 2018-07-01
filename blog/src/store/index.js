import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api: 'http://' + location.hostname + ':8080/',
    user: {
      image: 'image/default.png'
    },
    flag: false,
    articleList: []
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
    
  },
  actions: {
    getUserInformation({ state, getters }) {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'get',
          url: getters.getApi('login'),
          xhrFields: {withCredentials: true},
          success: (json) => {
            state.flag = json.flag;
            if(state.flag) {
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