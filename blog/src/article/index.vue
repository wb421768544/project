<template>
  <div class="article-container">
    <div class="article-area">
      <IconCard
        class="shift"
        :article="article"
        :stars="article.starJSON"
        :author="authorInfor"
      />
      <article>
        <Header
          :authorInfor="authorInfor || {}"
          :article="article"
          :date="date"
        />
        <MavonEditor
          default-open="preview"
          :subfield="false"
          :editable="false"
          :boxShadow="false"
          :navigation="false"
          :toolbarsFlag="false"
          :value="article.content"
          :code-style="'atom-one-dark'"
        />
      </article>
      <AuthorCard
        class="shift"
        :article="article"
        :author="authorInfor"
      />
    </div>
    <CommentCard :comments="comments" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { fetchArticle } from '@/request';

import Header from './header.vue';
import IconCard from './icon-card.vue';
import AuthorCard from './author-card.vue';
import CommentCard from './comment-card.vue';
import { mavonEditor as MavonEditor } from "mavon-editor";

export default {
  data() {
    return {
      show: true,
      authorInfor: {},
      article: {},
      comments: [],
    }
  },
  computed: {
    date() {
      const { timer } = this.article;
      return new Date(parseInt(timer)).toLocaleString();
    },
    ...mapGetters(['getApi', 'getUser']),
  },
  methods: {
    fetchData() {
      const { id } = this.$route.params;
      fetchArticle(id)
        .then(({ data }) => {
          if(data.flag) {
            const article = data.articleInfor;
            this.comments = article.comments;
            this.article = article.articleContent;
            this.authorInfor = article.author;
            this.authorInfor.image = this.getApi(this.authorInfor.image);
            this.$store.commit('setTitle', article.articleContent.title);
          }else{
            alert(data.reason);
            this.$router.replace('/');
          }
        });
    },
  },
  components: {
    Header,
    AuthorCard,
    CommentCard,
    MavonEditor,
    IconCard,
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.article-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.re-editor {
  color: black;
  font-size: 1.2em;
}
.article-area {
  display: flex;
  margin: 90px auto;
  width: 70%;
}
article {
  flex: 1;
  display: inline-block;
  width: 750px;
  background-color: #fff;
}
.author-info-box {
  display: inline-block;
  margin-left: 10px;
}
@media only screen and (max-width: 960px ) {
  article {
    width: 99%;
  }
  .shift {
    display: none;
  }
  .article-area {
    width: 99%;
  }
}
</style>