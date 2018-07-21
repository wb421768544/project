<template>
  <transition name="show">
  <div class="top-bar-container" v-if="checkPath"  v-show="show">
    <div class="top-bar">
      <router-link to="/">
        <img src="../../assets/wb.jpg" id="wb">
      </router-link>
      <router-link to="/" class="home">首页</router-link>
      <div class="form">
        <input id="query" type="text" placeholder="搜索文章" @keydown.enter="query">
        <img src="@/assets/search.svg" @click="query" />
      </div>
      <ul class="right">
        <li v-if="flag">
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
            <portrait-part></portrait-part>
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
      show: true,
      flag: false,
      checkPath: true
    };
  },
  methods: {
    query() {
      if($('#query').val().trim() != '') {
        this.$router.push('/search?query=' + $('#query').val());
      }
    },
    logout() {
      document.cookie = "id = ''";
      this.$router.push("/");
      location.reload();
    },
    hideTopBar() {
      var clear = 0, last = 0;
      var $window = $(window);
      window.onscroll = () => {
        clearTimeout(clear);
        clear = setTimeout(() => {
          var now = $window.scrollTop();
          if(now > last && now > 600) {
            this.show = false;
          } else if (now < last || now < 600) {
            this.show = true;
          }
          last = now;
        }, 100);
      };
    },
    requestUserInformation() {
      this.$store.dispatch('getUserInformation').then(() => {
        this.flag = true;
      }).catch((reason) => {});
    }
  },
  components: {
    portraitPart: Portrait
  },
  mounted() {
    this.checkPath = checkPath(this.$route);
    if (parseCookie(document.cookie).id && !this.flag) {
      this.requestUserInformation();
    }
    this.hideTopBar();
  },
  watch: {
    $route(to, from) {
      this.checkPath = checkPath(to);
    }
  }
};
</script>


<style scoped>
.show-enter, .show-leave-to {
  transform: translateY(-100%);
  transition: transform 0.2s;
}
.show-enter-to, .show-leave {
  transform: translateY(0%);
  transition: transform 0.2s;
}
.form {
  position: relative;
  display: inline-block; 
  z-index: 30;
  background-color: #fafafb;
}
input:focus { outline: 1px solid #007fff!important;}
.form img {
  right: 0;
  top: 50%;
  margin: 0;
  padding: 0 8px;
  position: absolute;
  transform: translate(0, -50%);
}
input {
  border: none;
  outline: none;
  padding: 0.6em 0;
  font-size: 0.85em;
  padding-left: 10px;
  border-radius: 2px;
  padding-right: 50px;
  vertical-align: middle;
  border: 1px solid #e6e6e7;
  background-color: transparent;
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
  min-width: 370px;
  max-width: 1000px;
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
  margin-right: 20px;
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
  transition: background 0.2s;
}
.btn-write-blog:hover { background-color: #0371df;}
@media only screen and (max-width: 500px) {
   .btn-write-blog, .home {
    display: none;
  }
  #wb {
    height: 30px;
  }
  .right li:first-child {
    margin: 0 ;
  }
  .write-icon {
    height: 2em;
  }
}
</style>