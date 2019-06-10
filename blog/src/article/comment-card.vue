<template>
  <div class="comment-block">
    <span>评论</span>
    <div class="comment-part">
      <img v-if="isLogin" :src="getApi(getUser.image)" class="portrait" />
      <img v-else src="../assets/tourist.svg" class="portrait" />
      <div id="autoInput" class="auto-input div-auto-input" contenteditable="true" @blur="judge"></div>
      <button @click="submit">评论</button>
    </div>
    <p v-if="comments.length == 0">还没有人评论。。。 快来抢沙发~</p>
    <div
      class="comments"
      v-for="(item, index) in comments"
      :key="index"
    >
      <img :src="getApi(item.image)" class="img">
      <span class="name">{{item.name}}</span>
      <span class="timer">{{getDate(item.timer)}}</span>
      <p class="comment-content">{{item.content}}</p>
      <i
        class="delete"
        :class="[{'show': item.id == getUser.id}]"
        @click="delComment(item.timer, item.article_id, index)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  data() {
    return {
      flag: true,
      text: '',
    };
  },
  props: ["comments"],
  computed: {
    ...mapGetters(['getApi', 'getUser', 'isLogin']),
  },
  methods: {
    getDate(timer) {
      return new Date(parseInt(timer)).toLocaleString();
    },
    judge() {
      if(!$("#autoInput")[0].innerHTML) {
        this.flag = true;
      }
    },
    submit() {
      var comment = $("#autoInput").text().trim();
      $("#autoInput").text("");
      if(!this.isLogin) {
        return ;
      }
      var str = comment.replace(/[\r\n]/g, "");
      if (str.length == 0) {
        return alert("评论不能为空。");
      } else if (str.length > 1000) {
        return alert("打的字太多啦。");
      }
      $("#autoInput").text("");
      var data = {
        timer: Date.now(),
        content: comment,
        name: this.getUser.name,
        article_id: this.$route.params.id,
        image: this.getUser.image
      };
      $.ajax({
        url: this.getApi('submit?action=comment'),
        type: "post",
        data,
        success: json => {
          if (json.flag) {
            data.id = this.getUser.id;
            this.comments.unshift(data);
          }
        },
        xhrFields: { withCredentials: true }
      });
    },
    delComment(timer, id, index) {
      if (confirm("确定要删除这条评论吗？")) {
        $.ajax({
          url: this.getApi(`submit?action=delete&timer=${timer}&article_id=${id}`),
          type: "get",
          xhrFields: { withCredentials: true },
          success: json => {
            if (json.flag) {
              this.comments.splice(index, 1);
            }
          }
        });
      }
    }
  },
};
</script>

<style scoped>
.praise,
.delete {
  display: inline-block;
  visibility: hidden;
  height: 1.5em;
  width: 1.5em;
  background-position: center;
  background-size: cover;
  cursor: pointer;
}
.praise {
  background-image: url(../assets/praise.svg);
}
.delete {
  background-image: url(../assets/delete.svg);
}
.praise-after,
.praise:hover {
  background-image: url(../assets/praise-after.svg);
}
.delete:hover {
  background-image: url(../assets/delete-after.svg);
}
.comments {
  font-size: 1.3em;
  text-align: left;
  width: 83%;
  padding: 20px 15px;
  margin: auto;
  color: black;
  border-bottom: #f1f1f1 0.5px solid;
}
.comments:hover .show {
  visibility: visible;
}
.show {
  visibility: hidden;
}
.img {
  height: 38px;
  width: 38px;
  margin-right: 10px;
  vertical-align: middle;
  border-radius: 19px;
}
.comments p {
  width: 90%;
  margin-left: 40px;
  margin-bottom: 18px;
}
button {
  position: absolute;
  bottom: 10px;
  right: 25px;
  padding: 8px 20px;
  color: white;
  font-size: 1.6em;
  border-radius: 2px;
  background-color: #007fff;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #0371df;
}
.portrait {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  vertical-align: top;
}
.comment-block {
  color: #9c9c9c;
  width: 70%;
  padding-bottom: 50px;
  text-align: center;
  background-color: white;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
.comment-part {
  width: 80%;
  position: relative;
  margin: 20px auto;
  margin-top: 0;
  text-align: left;
  border-radius: 6px;
  padding: 20px 25px;
  padding-left: 5px;
  border: #f1f1f1 0.5px solid;
  background-color: rgb(248, 249, 250);
  white-space: nowrap;
}
.comment-block > span {
  font-size: 1.8em;
  line-height: 2.5em;
}
.auto-input {
  resize: none;
  width: 92%;
  outline: none;
  padding: 12px;
  font-size: 1.6em;
  border-radius: 5px;
  color: black;
  margin: 10px 0 40px 10px;
  box-sizing: border-box;
  border: #dddddd 0.5px solid;
  display: inline-block;
  min-height: 60px;
  max-height: 500px;
  background-color: white;
  word-wrap: break-word;
  white-space:pre-line;
  overflow-x: hidden;
  overflow-y: auto;
}
.auto-input,
.auto-input:hover {
  transition: border 0.5s;
}
.auto-input:hover,
.auto-input:focus {
  border: rgb(0, 127, 255) 0.5px solid;
}

.comment-content {
  word-wrap: break-word;
  white-space:pre-line;
}

.timer {
  font-size: .8em;
  float: right;
  color: gray;
}
#autoInput {
  margin-bottom: 2em;
}
@media only screen and (max-width: 960px ) {
  .comment-block {
    width: 100%;
  }
  .show {
    visibility: visible!important;
  }
}
@media only screen and (max-width: 500px ) {
  .comment-part {
    font-size: 0.5em;
  }
  .portrait {
    height: 30px;
    width: 30px;
  }
  .img {
    height: 25px;
    width: 25px;
  }
}
</style>