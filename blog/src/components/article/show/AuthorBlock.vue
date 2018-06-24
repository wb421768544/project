<template>
  <div class="author-block">
    <div class="block-title">关于作者</div>
    <div class="author">
      <img :src="author.image">
      <div class="author-info-box">
        <span class="author-name">{{author.name}}</span><br />
      </div>
    </div>
    <div class="author-info">
      <img src="../../../assets/be-star.svg" class="icon">
      <span>被收藏{{author.beStarNum}}次</span>
    </div>
    <div class="author-info">
      <img src="../../../assets/star.svg" class="icon">
      <span>收藏文章{{author.starNum}}篇</span>
    </div>
    <div class="author-info">
      <img src="../../../assets/article.svg" class="icon">
      <span>发表文章{{author.articleNum}}篇</span>
    </div>
  </div>
</template>

<script>
import scroll from '../../../methods/scroll'
export default {
  props: ['article', 'author'],
  mounted() {
    scroll($('.author-block')[0]);
  }
}
</script>

<style scopd>
.author-block {
  position: absolute;
  background-color: white;
  display: inline-block;
  vertical-align: top;
  width: 220px;
  box-sizing: border-box;
  margin-left: 16px;
  padding: 12px;
  white-space: nowrap;
}
.block-title {
  padding: 1em;
  font-size: 1.3em;
  border-bottom: 1px solid #f5f5f5;
}
.author-block .author {
  padding: 1.3em;
  font-size: 1.3em;
}
.icon {
  height: 1.5em;
  vertical-align: middle;
}
.author-info {
  font-size: 1.5em;
  padding-bottom: 0.5em;
  padding-left: 1.3em;
}
.author img{
  height: 3.4em;
  width: 3.4em;
  vertical-align: top;
  border-radius: 1.7em;
}
.author-info-box {
  display: inline-block;
  margin-left: 10px;
}
</style>
