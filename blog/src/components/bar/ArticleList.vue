<template>
<div>
  <div v-for="(item, index) in arr" :key="index"  class="article" @click="goToArticle(item.article_id)">
    <span class="type">{{item.type}}</span>
    <span class="author">{{item.name}}</span>
    <span class="time">{{new Date(parseInt(item.timer)).toLocaleString()}}</span>
    <p class="title">
      {{item.title}}
    </p>
    <button>
      <span class="icon icon-color" :class="{'have-star': artIdArr.indexOf(item.article_id) != -1}" title="收藏" @click.stop="star(index, $event)">
        <i class="icon-star"></i>
        {{item.star}}
      </span>
      <span class="icon" title="评论">
        <img src="@/assets/chat-bubble.svg">
       {{item.comment}}
      </span>
    </button>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
    };
  },
  methods: {
    goToArticle(article_id) {
      this.$router.push('/article/' + article_id);
    },
    star(index, event) {
      var num = 0;
      var target = event.target;
      var url = this.getApi('api?require=updatestar&num=');
      var target = $(target).is('span') ? target : target.parentNode;
      if($(target).is('.have-star')) {
        $(target).removeClass('have-star');
        num = -1;
      }else {
        $(target).addClass('have-star');
        num = 1;
      }
      url += `${num}&article_id=${this.arr[index].article_id}&name=${this.getUser.name}`;
      $.ajax({
        url,
        success(json) {
          if(!json.flag) {
            alert(json.reason);
          }
        },
        xhrFields: {withCredentials: true}
      });
      this.arr[index].star = parseInt(this.arr[index].star) + num;
    }
  },
  props: ['arr', 'artIdArr'],
  computed: {
    ...mapGetters(['getApi', 'getUser'])
  }
}
</script>

<style scoped>
.icon-star {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  background-size: cover;
  background-image: url(../../assets/before-article-star.svg);
}
.article {
  width: 100%;
  cursor: pointer;
  padding: 15px 30px;
  box-sizing: border-box;
  background-color: white;
  border: 1px solid #f4f5f6;
}
.time {
  margin: 0 10px;
  color:#b6bac2;
}
.title {
  display: block;
  font-size:1.2em;
  margin: 10px 0px;
  font-weight: bold;
}
.icon {
  font-size: 13px;
  color: #b2bac2;
  font-weight: bold;
  padding: 3px 10px;
  vertical-align: sub;
  display: inline-block;
  background-color: white;
  border:1px solid #edeeef;
}
.type { color: #b71ed7;}
.article button{ font-size: 0;}
.author:hover{ color: #007fff;}
.icon img { vertical-align: middle;}
.article > span { font-size: 0.77em;}
.have-star { color: rgb(29, 196, 0);}
.title:hover { text-decoration: underline;}
.icon:hover { background-color: #f7f8fa;}
.article:hover { background-color: #fcfcfc;}
.article > span:not(:nth-child(1))::before{content: "· ";}
.have-star .icon-star { background-image: url(../../assets/after-article-star.svg);}
</style>
