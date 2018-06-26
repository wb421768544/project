<template>
  <transition name="show" >
  <div class="top-bar-container" v-if="checkPath">
    <div class="top-bar">
      <router-link to="/">
        <img src="../../assets/wb.jpg" id="wb">
      </router-link>
      <router-link to="/">首页</router-link>
      <form>
        <input type="text" placeholder="搜索文章">
        <img src="@/assets/search.svg" />
      </form>
      <ul class="right">
        <li>
          <router-link to="/write">
            <img src="../../assets/write-article.svg" class="write-icon">
            <button class="btn-write-blog">写文章</button>
          </router-link>
        </li>
          <li v-if="!flag">
            <router-link to="/login">登录</router-link>
          </li>
          <li v-if="!flag">
            <router-link to="/signup">注册</router-link>
          </li>
          <li v-else>
            <portrait-part :name="name" :portrait="portrait"></portrait-part>
          </li>
      </ul>       <!-- ul.right -->
    </div>      <!--top-bar -->
  </div> 
  </transition>
</template>


<script>
import Portrait from '../bar/Portrait';
import checkPath from '@/methods/checkPath';
import parseCookie from "@/methods/parseCookie";
export default {
  data() {
    return {
      name: '',
      flag: false,
      portrait: '',
      checkPath: true
    };
  },
  methods: {
    logout() {
      document.cookie = "id = ''";
      this.$router.push("/");
      location.reload();
    }
  },
  components: {
    portraitPart: Portrait
  },
  mounted() {
    this.checkPath = checkPath(this.$route);
    if (parseCookie(document.cookie).id && !this.flag) {
      let api = 'http://' + location.hostname + ':8080/';
      let str = api + "login";
      $.ajax({
        method: "get",
        url: str,
        xhrFields: {
          withCredentials: true
        },
        success: (data) => {
          if (data.status === "success") {
            this.flag = true;
            this.name = data.name;
            this.portrait = api + data.image;
          }
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.checkPath = checkPath(to);
    }
  }
};
</script>


<style scoped>
form.focus {
  border: 1px solid #007fff;
}
form {
  display: inline-block; 
  border: 1px solid #e6e6e7;
  background-color: #fafafb;
}
form img {
  margin: 0;
  padding: 0 8px;
  vertical-align: middle;
}
input {
  border: none;
  outline: none;
  padding: 0.6em 0;
  font-size: 0.85em;
  padding-left: 10px;
  border-radius: 2px;
  vertical-align: middle;
  background-color: transparent;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.top-bar-container {
  top: 0;
  z-index: 5;
  width: 100%;
  position: fixed;
  background-color: white;
  box-shadow: 0 0 5px rgba(128, 128, 128, 0.293);
}
.top-bar {
  margin: 0 auto;
  min-width: 600px;
  max-width: 1200px;
  font-size: 1.5em;
  color: #007fff;
  font-weight: bold;
  padding: 10px  0;
  position: relative;
  white-space: nowrap;
  box-sizing: border-box;
}
#wb {
  width: 45px;
  vertical-align: middle;
}
.right {
  right: 0;
  top: 50%;
  position: absolute;
  transform: translate(0, -50%);
}
.right > li {
  margin: 0 10px;
  display: inline-block;
}
.right a {
  color: #007fff;
  text-decoration: none;
}
.write-icon {
  height: 1.5em;
  vertical-align: middle;
}
.btn-write-blog {
  height: 2.2em;
  width: 5.3em;
  color: white;
  border-radius: 0.2em;
  background-color: #007fff;
}
</style>