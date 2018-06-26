<template>
  <div id="container">
    <article class="article">
      <nav class="menu-bar">
        <div>
            <img :src="authorInfo.image">
            <span>{{authorInfo.name}}</span>
            <button>编辑个人资料</button>
        </div>
        <ul>
            <li @click="blog">我的博客</li>
            <li @click="star">我的收藏</li>
            <li @click="information">我的资料</li>
            <li @click="relationship">我的关系</li>
        </ul>
      </nav>
      <blog-star :arr="[articleInfo, stars]" :author="authorInfo.name" :show="show" />
      <self-information :self-infor="selfInfor" v-if="show[2]" :imgSrc="authorInfo.image" />
      <relationship :arr="[fans, follows]" :api="api" v-if="show[3]" />
    </article>
    <div class="side-bar">
      <div class="rs">
        <span>关注了</span><br>
        <span>{{(len[0])}}</span>
      </div>
      <div class="rs">
        <span>关注者</span><br>
        <span>{{(len[1])}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import BlogStar from "./BlogStar";
import Relationship from "./Relationship";
import SelfInformation from "./Information";
import parseCookie from "@/methods/parseCookie";
export default {
  name: "user",
  data() {
    return {
      len: [],
      fans: {},
      stars: {},
      follows: {},
      selfInfor: {},
      authorInfo: {},
      articleInfo: {},
      show: [true, false, false, false],
      api: "http://" + location.hostname + ":8080/"
    };
  },
  methods: {
    blog() {
      if (!this.show[0]) {
        this.request();
        this.updateView(1);
      }
    },
    star() {
      if (!this.show[1]) {
        $.ajax({
          url: this.api + "api?require=stars",
          success: this.getStar,
          xhrFields: { withCredentials: true }
        });
        this.updateView(2);
      }
    },
    information() {
      if (!this.show[2]) {
        $.ajax({
          url: this.api + "api?require=information",
          success: json => {
            this.selfInfor = json.information;
          },
          xhrFields: { withCredentials: true }
        });
        this.updateView(3);
      }
    },
    relationship() {
      if (!this.show[3]) {
        $.ajax({
          url: this.api + "api?require=relationship",
          success: json => {
            this.fans = json.fans;
            this.follows = json.follow;
          },
          xhrFields: { withCredentials: true }
        });
        this.updateView(4);
      }
    },
    getData(json) {
      if (!("data" in json)) {
        return ;
      }
      this.stars = json.stars;
      this.authorInfo = json.data;
      this.articleInfo = json.article;
      this.len[0] = this.authorInfo.fans.length;
      this.len[1] = this.authorInfo.follow.length;
      this.authorInfo.image = this.api + this.authorInfo.image;
      this.updateStar();
    },
    getStar(json) {
      this.stars = json.stars;
      this.updateStar();
    },
    updateStar() {   //stars和articleInfo中article_id相同则表示自己star了自己的文章，做标记
      var article = this.articleInfo,
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
        .css("color", "#007fff")
        .siblings()
        .css("color", "black");
      this.show = [false, false, false, false];
      this.show[index - 1] = true;
    },
    request() {
      let personalPromise = new Promise((resolve, reject) => {
        $.ajax({
          url: this.api + "api?require=personal",
          success: resolve,
          xhrFields: { withCredentials: true }
        });
      });
      let starPromise = new Promise((resolve, reject) => {
        $.ajax({
          url: this.api + "api?require=stars",
          success: resolve,
          xhrFields: { withCredentials: true }
        });
      });
      let allPromise = Promise.all([personalPromise, starPromise]);
      allPromise.then(([personal, JSONstars]) => {
        personal.stars = JSONstars.stars;
        this.getData(personal);
      });
    }
  },
  mounted() {
    if (parseCookie(document.cookie).id) {
      $.ajax({
        type: "get",
        url: this.api + "login",
        xhrFields: {
          withCredentials: true
        },
        success: data => {
          if (data.status === "success") {
            this.name = data.name;
            this.portrait += data.image;
          }
        }
      });
      this.request();
    }
  },
  components: {
    blogStar: BlogStar,
    relationship: Relationship,
    selfInformation: SelfInformation
  }
};
</script>


<style scoped>
button {
  background-color: transparent;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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
  display: inline-block;
}
.menu-bar button {
  right: 5%;
  bottom: 20%;
  border: 1px solid;
  padding: 10px 20px;
  border-radius: 5px;
  position: absolute;
}
.menu-bar li {
  height: 100%;
  width: 100px;
  padding: 20px;
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
.menu-bar li:first-child,
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
  width: 1150px;
  margin: 100px auto 0 auto;
  position: relative;
  white-space: nowrap;
}
.article,
.side-bar {
  display: inline-block;
}
.article {
  width: 74%;
}

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
</style>