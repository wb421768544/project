<template>
  <header class="author-container">
    <div class="author">
      <img :src="authorInfor.image">
      <div class="author-info-box">
        <span class="author-name">{{authorInfor.name}}</span><br />
        <span class="time">{{date}}</span>
        <span
          class="re-editor"
          v-if="authorInfor.id === getUser.id"
        >
          <router-link :to="'/edit/' + article.article_id">· 编辑</router-link>
        </span>
      </div>
    </div>
    <h1 class="article-title">{{article.title}}</h1>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['authorInfor', 'date', 'article'],
  computed: mapGetters(['getUser']),
}
</script>

<style scoped>
.author-container {
  padding: 24px;
  position: relative;
  z-index: 2;
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
.article-title {
  font-size: 3em;
}
.article-title:hover,
.re-editor:hover {
  color: #007fff;
}
</style>
