<template>
  <div>
    <div class="comment-block">
      <span>评论</span>
      <div class="comment-part">
        <img v-if="self.status != 'error'" :src="self.image" class="portrait"/>
        <img v-else src="../../../assets/tourist.svg" class="portrait"/>
        <textarea name="comment"
                  class="auto-input"
                  :placeholder="self.status != 'error'? '说说你的看法' : '登陆后方可评论'"
                  :disabled="self.status == 'error'? true : false"
                  maxlength="1000"
                  @keydown.enter="increase"
                  v-show="flag"
                  @click="toggle">
        </textarea><br v-show="flag">
        <div id="autoInput" class="auto-input div-auto-input" contenteditable="true" @blur="judge" v-show="!flag"></div>
        <span class="explain">Ctrl + Enter</span>
        <button class="btn-comment" @click="submit">评论</button>
      </div>
      <div v-if="comments.length == 0">还没有人评论。。。 快来抢沙发~</div>
      <div v-for="(item, index) in comments" :key="index" class="comments" @mouseenter="isSelfComment" @mouseleave="hiddenIcon">
        <img :src="api + item.image" class="img">
        <span class="name">{{item.name}}</span>
        <p class="comment-content">{{item.content}}</p>
        <!-- <i class="praise" @click="delComment(item.timer, item.article_id)"></i> -->
        <i class="delete" @click="delComment(item.timer, item.article_id, index)" :class="[{'show': item.id == self.id}]"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      api: "http://" + location.hostname + ":8080/",
      flag: true,
      text: "",
      image: "../../../assets/tourist.svg"
    };
  },
  props: ["comments", "self"],
  methods: {
    isSelfComment() {
      $('.show', $(event.target)).css('visibility', 'visible');
    },
    hiddenIcon() {
      $('.show', $(event.target)).css('visibility', 'hidden');
    },
    toggle() {
      if (this.self.status == "error") {
        return;
      }
      this.flag = !this.flag;
      this.$nextTick(() => {
        $("#autoInput").focus();
      });
    },
    judge() {
      if ($("#autoInput")[0].innerHTML == "") {
        this.flag = true;
      }
    },
    submit() {
      var comment = $("#autoInput").text();
      var str = comment.replace(/[\r\n]/g, "").trim();
      if (str.length == 0) {
        return alert("评论不能为空。");
      } else if (str.length > 1000) {
        return alert("打的字太多啦。");
      }
      $("#autoInput").text("");
      var i = this.self.image.indexOf("image");
      var data = {
        timer: Date.now(),
        content: comment,
        name: this.self.name,
        article_id: this.$route.params.id,
        image: this.self.image.substring(i)
      };
      $.ajax({
        url: this.api + "submit?action=comment",
        type: "post",
        data,
        success: json => {
          if (json.flag) {
            data.id = this.self.id;
            this.comments.unshift(data);
          }
        },
        xhrFields: { withCredentials: true }
      });
    },
    delComment(timer, id, index) {
      if (confirm("确定要删除这条评论吗？")) {
        $.ajax({
          url:
            this.api + `submit?action=delete&timer=${timer}&article_id=${id}`,
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
  }
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
  background-image: url(../../../assets/praise.svg);
}
.delete {
  background-image: url(../../../assets/delete.svg);
}

.praise-after,
.praise:hover {
  background-image: url(../../../assets/praise-after.svg);
}

.delete:hover {
  background-image: url(../../../assets/delete-after.svg);
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
.img {
  height: 38px;
  width: 38px;
  vertical-align: middle;
  border-radius: 19px;
}
.comments p {
  width: 90%;
  margin-left: 40px;
  margin-bottom: 18px;
}

.btn-comment,
.explain {
  position: absolute;
  bottom: 10px;
}
.btn-comment {
  right: 25px;
  color: white;
  font-size: 1.6em;
  padding: 8px 20px;
  border-radius: 2px;
  background-color: #007fff;
  transition: background-color 0.2s;
}
.explain {
  right: 120px;
  font-size: 2em;
  line-height: 2em;
}
.btn-comment:hover {
  background-color: #0371df;
}
.portrait {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  vertical-align: top;
}
.comment-block {
  margin-top: 50px;
  color: #9c9c9c;
  width: 750px;
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
  border: #f1f1f1 0.5px solid;
  background-color: rgb(248, 249, 250);
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
  margin: 0 0 30px 10px;
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
</style>