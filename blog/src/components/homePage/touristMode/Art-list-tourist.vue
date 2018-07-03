<template>
  <div>
    <div v-for="(item, index) in arr" :key="index" class="article" @click="goToArticle(item.article_id)">
      <p class="title">{{item.title}}</p>
      <span class="type" :class="classList[getArticleTypeList.indexOf(item.type)]">{{item.type}}</span>
      <a class="author-name">{{item.name}}</a>
      <span class="date">{{new Date(parseInt(item.timer)).toLocaleString()}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      classList: ['os', 'front', 'server', 'sql', 'internet']
    }
  },
  props: ['arr'],
  methods: {
    goToArticle(article_id) {
      this.$router.push('/article/' + article_id);
    }
  },
  computed: mapGetters(['getArticleTypeList'])
}
</script>

<style scoped>
.author-name { color: inherit;}
.author-name, .date { margin-left: 15px;}
.article {
  width: 100%;
  cursor: pointer;
  color: #909090;
  padding: 15px 30px;
  box-sizing: border-box;
  background-color: white;
  border: 1px solid #f4f5f6;
}
.article:hover { background-color: #fcfcfc;}
.title {
  color: black;
  cursor: pointer;
  font-size: 1.5em;
  font-weight: bold;
  margin: 5px 0 15px 0;
}
.title:hover { text-decoration: underline;}
.os { background-color: #42c67d;}
.sql { background-color: #e8596b;}
.front { background-color: #56c4e1;}
.server { background-color: #857dea;}
.internet { background-color: #ff955b;}
.type {
  width: 53px;
  padding: 3px;
  color: white;
  font-size: 1.2em;
  border-radius: 3px;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
}
</style>
