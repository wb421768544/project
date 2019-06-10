import Vue from 'vue';
import App from './App';
import store from './store.js';
import router from './router.js';

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');