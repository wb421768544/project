<template>
  <div>
    <div class="user-list">
      <ul class="classify">
        <li v-for="(item, index) in ['推荐', ...getArticleTypeList]" :key="index" :class="{'focus': index == 0}" @click="shift(index)">
          <a>{{item}}</a>
        </li>
      </ul>
      <div class="article-clist">
        <article-list :arr="articleList" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ArticleList from './Art-list-tourist';
export default {
  data() {
    return {
      articleList: []
    }
  },
  methods: {
    shift(index) {
      var $target = $(event.target);
      $target = $target.is('a') ? $target.parent() : $target;
      $target.addClass('focus').siblings().removeClass('focus');
      this.requestArticle(index);
    },
    requestArticle(num) {
      var options = ['推荐', ...this.getArticleTypeList];
      $.ajax({
        type: 'get',
        url: this.getApi(`getarticlelist?action=type&start=0&order=${options[num]}`),
        success: (json) => {
          if(json.flag) {
            this.$store.commit('setArticleTypeList', json.articleType);
            this.articleList = json.articleList;
          }else{
            console.error(json.reason);
          }
        }
      });
    }
  },
  computed: {
    ...mapGetters(['getApi', 'getArticleTypeList']),
  },
  components: {
    articleList: ArticleList
  },
  mounted() {
    this.requestArticle(0);
  }
}
</script>

<style scoped>
.classify {
  user-select: none;
  background-color: white;
  padding: 15px;
}
.classify li{
  display: inline;
  padding: 0 15px;
}
.classify .focus a{ color: #007fff!important;}
.classify li a:hover { color: #007fff!important;}
.classify a {
  font-size: 1.4em;
  color: #b4bec3!important;
}
</style>
