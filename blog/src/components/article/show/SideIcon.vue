<template>
  <div class="side-icon">
    <div title="点击收藏" @click="star">
      <i class="icon-star icon" :class="[{'icon-star-after': self.id in starJSON}]"></i>
      <span class="num">{{article.star}}</span>
    </div>
    <div title="查看评论" @click="comment">
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
import scroll from '../../../methods/scroll'
export default {
  data() {
    return {
      starJSON: {}
    };
  },
  props: ['article', 'author', 'self'],
  methods: {
    star() {
      var url = 'http://localhost:8080/api?require=updatestar&num=';
      var num = 0;
      if($('.icon-star').is('.icon-star-after')) {
        $('.icon-star').removeClass('icon-star-after');
        num = -1;
      }else {
        $('.icon-star').addClass('icon-star-after');
        num = 1;
      }
      url += num + '&article_id=' + this.article.article_id + '&name=' + this.author.name;
      $.ajax({
        url,
        success(json) {
          if(!json.flag) {
            alert(json.reason);
          }
        },
        xhrFields: {withCredentials: true}
      });
      this.article.star = parseInt(this.article.star) + num;
    },
    comment() {
      // $('.comment-block')[0].scrollIntoView();
    }
  },
  mounted() {
    scroll($('.side-icon')[0]);
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
.icon {
  width: 1.5em;
  height: 1.2em;
  box-sizing: border-box;
  display: inline-block;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: middle;
}
.side-icon {
  font-size: 1.8em;
  position: absolute;
  top: 150px;
  left: -80px;
  user-select: none;
}
.side-icon div {
  cursor: pointer;
  text-align: center;
  position: relative;
  border-radius: 2em;
  padding: 0.4em;
  margin-bottom: 1em;
  background-color: white;
}
.num {
  position: absolute;
  display: inline-block;
  width: 1.5em;
  background-color: #c6c6c6;
  color: white;
  top: -6px;
  right: -6px;
  border-radius: 0.5em;
  font-size: 0.5em;
}
.icon-star {background-image: url(../../../assets/star-before.svg);}
.icon-comment {
  background-image: url(../../../assets/comment-before.svg);
  background-size: 80% 80%;
}
.icon-qq {background-image: url(../../../assets/share-qq.svg);}
.icon-wechat {background-image: url(../../../assets/share-wechat.svg);}

.icon-star:hover, .icon-star-after {background-image: url(../../../assets/star-after.svg);}
.icon-comment:hover {background-image: url(../../../assets/comment-after.svg);}
.icon-qq:hover {background-image: url(../../../assets/share-qq-hover.svg);}
.icon-wechat:hover {background-image: url(../../../assets/share-wechat-hover.svg);}
</style>