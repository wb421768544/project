<template>
  <div>
    <div v-if="show[index]"  v-for="(part, index) in arr" :key="index">
      <div v-for="(people, cur) in part" :key="cur" :class="{'star-article':index != 0 || people.status}" @click="goToArticle(people.article_id)" class="article">
        <span class="type">{{people.type}}</span>
        <span class="author">{{people.name || author}}</span>
        <span class="time">{{new Date(parseInt(people.timer)).toLocaleString()}}</span>
        <p class="title">{{people.title}}</p>
        <button>
          <span class="icon icon-color" :class="{'have-star': (people.status || index == 1)}" title="收藏" @click.stop="toggleColor(cur, index)">
            <i class="icon-star"></i>
            {{people.star}}
          </span>
          <span class="icon" title="评论">
            <img src="@/assets/chat-bubble.svg">
            {{people.comment}}
          </span>
        </button>
      </div>   <!-- .article -->
      <div v-if="arr[index].length == 0" class="empty">
        <p v-show="index == 0" class="empty-text">{{$parent.person}}还没有发表过任何文章。。。</p>
        <p v-show="index == 1" class="empty-text">{{$parent.person}}还没有收藏任何文章。。。</p>
        <img src="@/assets/empty-box.svg" />
      </div>
    </div>  <!-- show[index] -->
  </div>
</template>

<script>
export default {
  methods: {
    goToArticle(article_id) {
      this.$router.push('/article/' + article_id);
    },
    toggleColor(cur, index) {
      if(!this.$store.getters.isLogin) {
        return alert('请登录');
      }
      var num = 0, $target = $(event.target);
      $target = $target.is('i') ? $($target[0].parentElement) : $target;
      if($target.is('.have-star')) {
        $target.removeClass('have-star');
        num = -1;
      } else {
        $target.addClass('have-star');
        num = 1;
      }
      this.arr[index][cur].star = parseInt(this.arr[index][cur].star) + num;
      var requerURL = this.$store.getters.getApi(`api?require=updatestar&num=${num}&article_id=${this.arr[index][cur].article_id}&name=${this.$store.getters.getUser.name}`);
      $.ajax({
        url: requerURL,
        xhrFields:{withCredentials:true},
        success: (json) => {
          if(!json.flag) {
            return alert(json.reason);
          }
        }
      });
    }
  },
  props: ['arr', 'show', 'author']
}
</script>

<style scoped>
.empty {
  padding: 30px;
  text-align: center;
  background-color: white;
}
.empty-text {
  color: #707070;
  font-size: 2em;
}
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