<template>
  <div>
    <img :src="getApi(getUser.image)" id="portrait" :title="getUser.name" @click="show = !show">
    <ul class="list" v-show="show">
      <li><router-link to="/user">我的博客</router-link></li>
      <li><router-link to="/star">收藏</router-link></li>
      <li><router-link to="">账号设置</router-link></li>
      <li><a @click="logout">退出登录</a></li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      show: false
    };
  },
  methods: {
    logout() {
      document.cookie = "id = ''";
      this.$router.push("/");
      location.reload();
    }
  },
  computed: mapGetters(['getUser', 'getApi'])
}
</script>

<style scoped>
.list {
  right: 5px;
  font-size: 0.6em;
  line-height: 2em;
  font-weight: bold;
  text-align: right;
  position: absolute;
  background-color: white;
  padding: 25px 25px 25px 30px;
  box-shadow: 0px 5px 5px rgba(128, 128, 128, 0.301);
}
.list li a { color: #71777c;}
#portrait {
  width: 2em;
  height: 2em;
  margin: 0 30px;
  cursor: pointer;
  border-radius: 2em;
  vertical-align: middle;
}
</style>