<template>
  <div>
    <div class="user-nav">
      <img :src="getApi(getUser.image)" />
      <router-link to="/write"><i class="icon-write"></i>写文章</router-link>
      <router-link :to="'/user/' + getUser.id"><i class="icon-personal"></i>个人中心</router-link>
      <a class="setting">设置</a>
    </div>
    <div class="user-list">
      <ul class="classify">
        <li v-for="(item, index) in ['热门', '最新', '评论']" :key="index" :class="{'focus': index == 0}" @click="shift(index)">
          <a>{{item}}</a>
        </li>
      </ul>
      <div class="article-clist">
        <article-list :arr="articleArray" :art-id-arr="starArticleId"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ArticleList from '../../bar/ArticleList'
export default {
  data() {
    return {
      articleArray: [],
      starArticleId: []
    }
  },
  methods: {
    shift(index) {
      var $target = $(event.target);
      $target = $target.is('a') ? $target.parent() : $target;
      $target.addClass('focus').siblings().removeClass('focus');
      this.requestArticleOrderBy(index);
    },
    requestArticleOrderBy(num) {
      var options = ['star', 'timer', 'comment'];
      $.ajax({
        type: 'get',
        xhrFields: {withCredentials: true},
        url: this.getApi(`getarticlelist?start=0&order=${options[num]}`),
        success: (json) => {
          if(json.flag) {
            this.starArticleId = json.starArticle_id.map( (val) => {
              return val.article_id;
            })
            this.articleArray = json.articleList;
          }else{
            console.error(json.reason);
          }
        }
      });
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getApi']),
  },
  components: {
    articleList: ArticleList
  },
  mounted() {
    this.requestArticleOrderBy(0);
  }
}
</script>

<style scoped>
.classify {
  user-select: none;
  background-color: white;
  margin-top: 10px;
  padding: 15px;
}
.classify .focus a{
  color: #007fff!important;
}
.classify li{
  display: inline;
  padding: 0 15px;
}
.classify li:nth-child(2) {
  border-left: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
}
.classify li a:hover {
  color: #007fff!important;
}
.classify a {
  font-size: 1.4em;
  color: #b4bec3!important;
}
.user-nav img {
  height: 50px;
  width: 50px;
  vertical-align: middle;
}
.user-nav a {
  margin-left: 40px;
  color: #007fff; 
  display: inline-block;
  font-size: 1.4em;
  vertical-align: middle;
}
.user-nav a:hover {
  color: #0371df;
}
.user-nav {
  overflow: hidden;
  border-radius: 3px;
  position: relative;
  height: 50px;
  box-sizing: border-box;
  background-color: white;
  box-shadow: 0 0 10px #eceded;
}
i {
  vertical-align: bottom;
  width: 18px;
  height: 18px;
  display: inline-block;
  background-size: cover; 
  background-position: center;
}
.setting {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translate(0, -50%);
  color: #909090!important;
}
.setting:hover {
  color: #007fff!important; 
}
.icon-personal { background-image: url(../../../assets/personal-center.svg); }
.icon-write { background-image: url(../../../assets/write-article.svg);}
</style>
