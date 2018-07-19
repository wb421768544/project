<template>
  <div>
    <img :src="getApi(getUser.image)" id="portrait" :title="getUser.name" @click="show = !show">
    <transition name="toggle">
      <ul class="list" v-show="show">
        <li @click="agent()"><a>我的博客</a></li>
        <li @click="agent('stars')"><a>收藏</a></li>
        <li @click="agent('information')"><a>账号设置</a></li>
        <li><a @click="logout">退出登录</a></li>
      </ul>
    </transition>
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
    agent(parameter = '') {
      let path = `/user/${this.getUser.id}/${parameter}`;
      this.$router.push(path);
      this.show = false;
    },
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
.toggle-enter-active, .toggle-leave-active {
  transition: opacity .5s;
}
.toggle-enter, .toggle-leave-to {
  opacity: 0;
}
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
@media only screen and (max-width: 600px) {
  #portrait {
    margin: 0;
  }
}
</style>