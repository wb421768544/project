<template>
<div class="published-block">
  <div class="thanks">
    <p>发布成功！有了你的分享，IT会变得更好！</p>
  </div>
  <div class="shared-block">
    <p><router-link :to="'/article/' + id">{{title}}</router-link></p>
    <router-link to="/user"><button>我的博客</button></router-link>
    <router-link to="/"><button>返回首页</button></router-link>
  </div>
</div>
</template>

<script>
export default {
  props: ['title', 'id']
}
</script>

<style scoped>
.published-block {
  width: 800px;
  margin: 100px auto;
  text-align: center;
}
.thanks {
  color: #666;
  font-size: 2em;
  padding-top: 230px;
  background-size: 25%;
  background-position: 50% 0%;
  background-repeat: no-repeat;
  background-image: url(../../../assets/finish.png);
}
.shared-block {
  padding: 20px 0;
  margin-top: 50px;
  background-color: #fff;
}
button {
  margin: 5px;
  color: white;
  padding: 8px 10px;
  border-radius: 3px;
  background-color: #007fff;
}
.shared-block p {
  padding: 20px 0;
  cursor: pointer;
  font-size: 2em;
  font-weight: bold;
  text-decoration: underline;
}
</style>
