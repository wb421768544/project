<template>
  <div>
    <div class="article-area">
      <article class="article">
        <div class="author-container">
          <div class="author">
            <img :src="authorInfor.image">
            <div class="author-info-box">
              <span class="author-name">{{authorInfor.name}}</span><br />
              <span class="time">{{new Date(parseInt(article.timer)).toLocaleString()}}</span>
              <span class="re-editor" v-if="authorInfor.id === getUser.id">
                <router-link :to="'/edit/' + article.article_id">· 编辑</router-link>
              </span>
            </div>
          </div>
          <h1 class="article-title">{{article.title}}</h1>
        </div>
        <div id="editor">
          <mavon-editor :subfield="false" default-open="preview" :editable="false"  :code-style="'atom-one-dark'" :toolbarsFlag="false" :navigation="false" :boxShadow="false" :value="value" />
        </div>
      </article>
      <author-block :article="article" :author="authorInfor" />
      <side-icon :article="article" :stars="article.starJSON" :author="authorInfor" />
      <comments-part :comments="comments" />
    </div>
    <img src="../../assets/top.svg" class="top" @click="goBack">
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SideIcon from './show/SideIcon';
import { mavonEditor } from "mavon-editor";
import AuthorBlock from './show/AuthorBlock';
import CommentsPart from './show/CommentsPart';

export default {
  data() {
    return {
      show: true,
      authorInfor: {},
      article: {},
      comments: [],
      value: ''
    }
  },
  components: {
    'side-icon': SideIcon,
    'author-block': AuthorBlock,
    'mavon-editor': mavonEditor,
    'comments-part': CommentsPart
  },
  methods: {
    getData(json) {
      if(json.flag) {
        let article = json.articleInfor;
        this.comments = article.comments;
        this.article = article.articleContent;
        this.authorInfor = article.author;
        this.authorInfor.image = this.getApi(this.authorInfor.image);
        this.value = this.article.content;
      }else{
        alert(json.reason);
        this.$router.replace('/');
      }
    },
    goBack() {
      $('html').animate({scrollTop: '0px'});
      $('body').animate({scrollTop: '0px'});
    }
  },
  computed: mapGetters(['getApi', 'getUser']),
  mounted() {
    $.ajax({
      url: this.getApi('article?id=' + this.$route.params.id),
      type: 'post',
      success: this.getData,
      xhrFields: {withCredentials: true}
    });
  },
  beforeRouteUpdate(to, from, next) {
    $.ajax({
      url: this.getApi('article?id=' + to.params.id),
      type: 'post',
      success: this.getData,
      xhrFields: {withCredentials: true}
    });
  }
}
</script>

<style scoped>
.re-editor {
  color: black;
  font-size: 1.2em;
}
#editor {
  width: 100%;
  position: relative;
  z-index: 1;
}
.author-container {
  padding: 24px;
  position: relative;
  z-index: 2;
}
 .top {
  padding: 5px;
  height: 25px;
  position: fixed;
  bottom: 50px;
  right: 50px;;
  border-radius: 25px;
  background-color: #fff;
}
.article-area {
  white-space: nowrap;
  margin: 90px auto;
  width: 900px;
  position: relative;
}
.article {
  width: 750px;
  background-color: #fff;
  display: inline-block;
}
.author img{
  height: 3.4em;
  width: 3.4em;
  vertical-align: top;
  border-radius: 1.7em;
}
.author-name {
  font-size: 1.7em;
  font-weight: bold;
}
.time {
  font-size: 1.2em;
  color: #909090;
  letter-spacing: 1px;
}
.author-info-box {
  display: inline-block;
  margin-left: 10px;
}
.article-title { font-size: 3em;}
.article-title:hover , .re-editor:hover{ color: #007fff;}
</style>