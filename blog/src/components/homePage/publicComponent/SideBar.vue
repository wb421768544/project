<template>
  <div>
    <div class="side-top-bar">
      <p>WB-Blog</p>
      <p>一个帮助开发者成长的地方~</p>
      <button><a>立即注册</a></button>
    </div>
    <div class="label">
      <p>暂时支持以下标签</p>
      <span v-for="(item, index) in getArticleTypeList" :key="index">{{item}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: mapGetters(['getArticleTypeList'])
}
</script>

<style scoped>
.label span:hover {
  color: white;
  background-color: #00cc00;
}
.label span {
  margin: 10px;
  cursor: pointer;
  font-size: 1.5em;
  padding: 5px 20px;
  border-radius: 30px;
  display: inline-block;
  background-color: #f3f6f3;
}
.label p {
  padding: 0 0 10px 10px;
  border-bottom: 1px solid rgb(246, 246, 246);
}
.label {
  margin-top: 20px;
  padding: 10px;
  width: 240px;
  white-space: pre-wrap;
}
.side-bar > div {
  border-radius: 3px;
  background-color: white;
}
.side-top-bar {
  width: 240px;
  padding: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.side-top-bar button {
  margin: auto;
  display: block;
  padding: 8px 40px;
  border-radius: 3px;
  background-color: #007fff;
  transition: background 0.2s;
}
.side-top-bar button:hover { background-color: #0371df;}
.side-top-bar button a {
  color: white;
}
.side-top-bar p:first-child {
  font-weight: bold;
  font-size: 1.3em;
}
p {
  font-size: 1.5em;
  margin: 9px 0;
}
</style>
