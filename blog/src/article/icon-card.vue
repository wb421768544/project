<template>
  <div class="side-icon">
    <div title="点击收藏" @click="star">
      <i class="icon-star icon" :class="[{'icon-star-after': getUser.id && (getUser.id in starJSON)}]"></i>
      <span class="num">{{article.star}}</span>
    </div>
    <div title="查看评论" @click="goToComment">
      <i class="icon-comment icon"></i>
      <span class="num">{{article.comment}}</span>
    </div>
    <div title="分享到QQ">
      <i class="icon-qq icon"></i>
    </div>
    <div title="分享到微信">
      <i class="icon-wechat icon"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetchStar } from '@/request';

export default {
  data() {
    return {
      starJSON: {},
    };
  },
  props: ['article', 'author', 'stars'],
  methods: {
    star() {
      if(!this.isLogin) {
        return alert('请登录');
      }
      let num = 0;
      if($('.icon-star').is('.icon-star-after')) {
        $('.icon-star').removeClass('icon-star-after');
        num = -1;
      }else {
        $('.icon-star').addClass('icon-star-after');
        num = 1;
      }
      const { name } = this.author;
      const { article_id: articleId } = this.article;
      this.$emit('updateStar', {
        num,
        name,
        articleId,
        callback: () => {
          this.article.star = Number(this.article.star) + num;
        },
      });
    },
    goToComment() {
      this.$emit('goToComment');
    }
  },
  computed: mapGetters(['getUser', 'getApi', 'isLogin']),
  mounted() {
    getFlag(this);
  }
}

function getFlag(self){
  if(self.article && self.article.starJSON) {
    self.starJSON = JSON.parse(self.article.starJSON);
  }else {
    setTimeout(tryAgain(self), 500);
  }

  function tryAgain(arg) {
    return function(){
      getFlag(arg);
    };
  }
}
</script>

<style scoped>
.side-icon {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin: 1em;
  padding: 1em;
}
.icon {
  width: 2em;
  height: 2em;
  display: inline-block;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: center;
}
.side-icon > div {
  position: relative;
  margin: 1em;
  padding: 0.4em;
  border-radius: 3em;
  background-color: white;
  cursor: pointer;
}
.num {
  position: absolute;
  width: 1em;
  height: 1em;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  text-align: center;
  border-radius: 50%;
  color: white;
  background-color: #c6c6c6;
}
.icon-star {background-image: url(../assets/star-before.svg);}
.icon-comment {
  background-image: url(../assets/comment-before.svg);
  background-size: 80% 80%;
}
.icon-qq {background-image: url(../assets/share-qq.svg);}
.icon-wechat {background-image: url(../assets/share-wechat.svg);}

.icon-star:hover, .icon-star-after {background-image: url(../assets/star-after.svg);}
.icon-comment:hover {background-image: url(../assets/comment-after.svg);}
.icon-qq:hover {background-image: url(../assets/share-qq-hover.svg);}
.icon-wechat:hover {background-image: url(../assets/share-wechat-hover.svg);}
</style>