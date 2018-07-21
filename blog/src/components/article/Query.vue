<template>
  <div class="container">
    <div class="user-list">
      <div class="article-clist">
        <article-list :arr="articleList" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ArticleList from '../homePage/touristMode/Art-list-tourist';
export default {
  name: 'Query',
  data() {
    return {
      articleList: []
    }
  },
  methods: {
    fuzzyQuery(keywords) {
      if(keywords == '') {
        return ;
      }
      $.ajax({
        type: 'get',
        url: this.$store.getters.getApi(`search?query=${keywords}`)
      }).then(json => {
        if(json.flag == true) {
          this.articleList = json.articleList;
        }else {
          throw new Error('Unknow Error.');
        }
      }).catch(err => {
        console.error(err);
      });
    }
  },
  computed: {
    ...mapGetters(['getApi']),
  },
  components: {
    articleList: ArticleList
  },
  mounted() {
    this.fuzzyQuery(this.$route.query.query);
    $('#query').val(this.$route.query.query);
  },
  destroyed() {
    $('#query').val('');
  }
}
</script>

<style scoped>
.container {
  margin-top: 100px;
  width: 950px;
  margin: 75px auto;
}
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
@media only screen and (max-width: 800px) {
  .classify li{
    padding: 0 10px;
  }
  .container {
    width: 98%;
  }
}
</style>
