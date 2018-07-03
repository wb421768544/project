<template>
  <div id="container">
    <article class="article">
      <nav class="menu-bar">
        <div>
          <img :src="getApi(getUser.image)">
          <span>{{getUser.name}}</span>
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
      <self-information v-if="show[2]" />
      <relationship v-if="show[3]" />
    </article>
    <div class="side-bar">
      <div class="rs" v-for="(item, index) in [{item: '关注了', number: fansNumber}, {item: '关注者', number: followNumber}]" :key="index">
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
      stars: {},
      authorInfo: {},
      articleInfo: {},
      fansNumber: 0,
      followNumber: 0,
      show: [true, false, false, false],
    };
  },
  methods: {
    blog() {
      if (!this.show[0]) {
        this.requestPersonBlogInformation();
        this.updateView(1);
      }
    },
    star() {
      if (!this.show[1]) {
        $.ajax({
          url: this.getApi('api?require=stars'),
          success: this.getStar,
          xhrFields: { withCredentials: true }
        });
        this.updateView(2);
      }
    },
    information() {
      if (!this.show[2]) {
        this.updateView(3);
      }
    },
    relationship() {
      if (!this.show[3]) {
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
      this.fansNumber = this.authorInfo.fans.length;
      this.followNumber = this.authorInfo.follow.length;
      this.authorInfo.image = this.getApi(this.authorInfo.image);
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
    requestPersonBlogInformation() {
      let personalPromise = new Promise((resolve, reject) => {
        $.ajax({
          url: this.getApi('api?require=personal'),
          success: resolve,
          xhrFields: { withCredentials: true }
        });
      });
      let starPromise = new Promise((resolve, reject) => {
        $.ajax({
          url: this.getApi('api?require=stars'),
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
  computed: mapGetters(['getUser', 'getApi']),
  mounted() {
    this.requestPersonBlogInformation();
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
</style>