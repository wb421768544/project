<template>
  <div id="container">
    <article class="article">
      <nav class="menu-bar">
        <div>
          <img :src="authorImage">
          <span>{{authorInfo.name}}</span>
          <button v-if="isLogin && getUser.id == userId" @click="information">编辑个人资料</button>
          <button v-else class="focus" :class="{focused: focusedFlag}" @click="focus">关注</button>
        </div>
        <ul class="person" :class="{self: getUser.id == userId}">
          <li @click="blog" class="now">的博客</li>
          <li @click="star">的收藏</li>
          <li @click="relationship">的关系</li>
          <li v-if="isLogin && getUser.id == userId" @click="information">的资料</li>
        </ul>
      </nav>
      <blog-star :arr="[articleInfo, stars]" :author="authorInfo.name" :show="show" />
      <relationship v-if="show[2]" />
      <self-information v-if="show[3]" />
    </article>
    <div class="side-bar">
      <div class="rs" v-for="(item, index) in [{item: '关注了', number: followNumber}, {item: '关注者', number: fansNumber}]" :key="index">
        <span>{{item.item}}</span><br>
        <span>{{item.number}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import BlogStar from "./BlogStar";
import Relationship from "./Relationship";
import SelfInformation from "./Information";
import { mapGetters } from 'vuex';
export default {
  name: "user",
  data() {
    return {
      userId: '',  //当前用户，任何人可看的
      stars: {},
      person: '他',
      focusedFlag: false,
      authorInfo: {},
      articleInfo: {},
      authorImage: '',
      fansNumber: 0,
      followNumber: 0,
      show: [true, false, false, false],
    };
  },
  methods: {
    focus() {
      if(!this.isLogin) {
        return alert('请登录');
      }
      $.ajax({
        url: this.getApi(`api?require=focus&id=${this.userId}`),
        xhrFields:{withCredentials:true},
      }).then(json => {
        if(json.flag) {
          this.focusedFlag = !this.focusedFlag;
        }else {
          throw new Error(json.reason);
        }
      }).catch(err => {
        console.error(err);
      })
    },
    blog() {
      if (!this.show[0]) {
        this.requestPersonBlogInformation(this.userId);
        this.updateView(1);
      }
    },
    star() {
      if (!this.show[1]) {
        $.ajax({
          url: this.getApi(`api?require=stars&id=${this.userId}`),
          success: this.getStar,
          xhrFields: { withCredentials: true }
        });
        this.updateView(2);
      }
    },
    information() {
      if (!this.show[3]) {
        this.updateView(4);
      }
    },
    relationship() {
      if (!this.show[2]) {
        this.updateView(3);
      }
    },
    getData(json) {
      if (!("data" in json)) {
        return ;
      }
      this.stars = json.stars;
      this.authorInfo = json.data;
      this.articleInfo = json.article;
      this.fansNumber = this.authorInfo.fans.length;
      this.followNumber = this.authorInfo.follow.length;
      this.focusedFlag = this.authorInfo.fans.indexOf(this.getUser.id) != -1;
      this.authorImage = this.getApi(this.authorInfo.image);
      this.$store.commit('setTitle', this.authorInfo.name);
      this.updateStar();
    },
    getStar(json) {
      this.stars = json.stars;
      this.updateStar();
    },
    updateStar() {   //stars和articleInfo中article_id相同则表示自己star了自己的文章，做标记
      if(!this.isLogin || this.getUser.id != this.userId) {
        return ;
      }
      let article = this.articleInfo,
        stars = this.stars;
      for (let i = 0, len = article.length; i < len; i++) {
        for (let j = 0, l = stars.length; j < l; j++) {
          if (article[i].article_id == stars[j].article_id) {
            article[i].status = true;
          }
        }
      }
    },
    updateView(index) {
      $(`.menu-bar li:nth-child(${index})`)
        .addClass('now')
        .siblings()
        .removeClass('now');
      this.show = [false, false, false, false];
      this.show[index - 1] = true;
    },
    requestPersonBlogInformation(userId) {
      let personalPromise = new Promise((resolve, reject) => {
        $.ajax({
          url: this.getApi(`api?require=personal&id=${userId}`),
          success: resolve,
          xhrFields: { withCredentials: true }
        });
      });
      let starPromise = new Promise((resolve, reject) => {
        $.ajax({
          url: this.getApi(`api?require=stars&id=${userId}`),
          success: resolve,
          xhrFields: { withCredentials: true }
        });
      });
      let allPromise = Promise.all([personalPromise, starPromise]);
      allPromise.then(([personal, JSONstars]) => {
        personal.stars = JSONstars.stars;
        this.getData(personal);
      });
    },
    jumpToPath() {
      let arr = [this.star, this.information, this.relationship];
      let options = ['stars', 'information', 'relationship'];
      let obj = this.$route.path.match(/[_a-z0-9]*$/);
      let index = options.indexOf(obj[0]);
      if(index != -1) {
        arr[index]();
      }
      return [obj, index];
    }
  },
  computed: mapGetters(['getUser', 'getApi', 'isLogin']),
  mounted() {
    this.requestPersonBlogInformation(this.userId = this.$route.path.match(/user\/([\w]{6,16})\/?/)[1]);
    if(this.$route.hash == '#setting') {
      this.information();
      this.updateView(4);
    }
  },
  components: {
    blogStar: BlogStar,
    relationship: Relationship,
    selfInformation: SelfInformation
  },
  beforeRouteUpdate(to, from) {
    this.jumpToPath();
  }
};
</script>

<style scoped>
.now {
  color: #007fff;
}
.person li::before {
  content: '他';
}
.self li::before {
  content: '我';
}
.focused::before {
  content: '已';
}
.focus {
    color: white!important;
    font-size: 1.5em!important;
    padding: 13px 35px!important;
    border-radius: 5px;
    background-color: #92c452;
}
.focus:hover { background-color: #a7cf74;}
.focus:active { background-color: #92c452;}
button {
  user-select: none;
  background-color: transparent;
}
.menu-bar {
  font-family: Arial, Helvetica, sans-serif;
  white-space: nowrap;
}
.menu-bar img {
  width: 90px;
  height: 90px;
  border-radius: 45px;
  vertical-align: middle;
}
.menu-bar span:nth-child(2) {
  float: none;
  margin: 20px;
  font-size: 1.5em;
  font-weight: bold;
  vertical-align: top;
  display: inline-block;
}
.menu-bar button {
  right: 5%;
  bottom: 18%;
  border: 1px solid;
  padding: 10px 20px;
  border-radius: 5px;
  position: absolute;
}
ul li {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  width: 25%;
  font-size: 12px;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
  display: inline-block;
  border-bottom: 3px solid;
}
.menu-bar ul {
  font-size: 0;
}
.menu-bar > div {
  box-sizing: border-box;
}
.menu-bar button {
  color: #007fff;
}
.menu-bar > div,
.menu-bar li {
  background-color: white;
}
.menu-bar > div {
  width: 100%;
  padding: 15px 20px;
}
.rs {
  color: #31445b;
  cursor: pointer;
  display: inline-block;
  width: 45%;
  font-size: 2em;
}
.rs:hover :nth-child(3) {
  text-decoration: underline;
}
#container {
  width: 1000px;
  position: relative;
  white-space: nowrap;
  margin: 100px auto 0 auto;
}
.article,
.side-bar {
  display: inline-block;
}
.article { width: 75%;}
.side-bar {
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
  background-color: white;
  width: 23%;
  position: absolute;
  right: 0;
}
.rs,
.menu-bar > div {
  position: relative;
}
@media only screen and (max-width: 960px) {
  .side-bar {
    display: none;
  }
  #container, .article {
    width: 98%;
  }
}
</style>