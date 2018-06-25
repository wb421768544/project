<template>
  <div id="editor">
    <div class="title" v-if="!published">
      <input type="text" placeholder="请输入文章标题..." maxlength="50" v-model="watchTitle" />
      <div class="tip-box">
        <span>暂不支持</span> <!-- 文章将会自动保存至 -->
        <a>草稿</a>
        <span @click="flag = !flag" id="publish">
          发布
          <i class="icon-slide-up" :class="{'icon-slide-down': flag}"></i>
        </span>
        <portrait-part :name="name" :portrait="portrait" class="portrait-part" />
        <div class="option" v-show="flag">
          <p>发布文章</p>
          <p>选择分类</p>
          <span>前端</span>
          <span>SQL</span>
          <span>OS</span><br>
          <span>后台</span>
          <span>计算机网络</span>
          <button @click="submit">确定并发布</button>
        </div>
      </div>
    </div>
    <mavon-editor v-if="!published" class="md" ref=md style="height: 90%;z-index:-1" v-model="value" :code-style="'atom-one-dark'" :navigation="false" @imgAdd="$imgAdd" />
    <published v-if="published" :title="title" :id="id" />
  </div>
</template>
<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import Portrait from '../../bar/Portrait';
import Published from './published';
export default {
  components: {
    mavonEditor,
    'portrait-part': Portrait,
    'published': Published
  },
  data() {
    return {
      id: '',
      name: '',
      value: '',
      title: '',
      flag: false,
      portrait: '',
      published: false,
      imgs: [],
      api: 'http://' + location.hostname + ':8080/'
    };
  },
  computed: {
    watchTitle: {
      get() {
        return this.title;
      },
      set(val) {
        val = val.trim();
        $('title').text('写文章-WB-' + val);
        this.title = val;
      }
    }
  },
  methods: {
     $imgAdd(pos, $file) {
      var formdata = new FormData();
      var xhr = new XMLHttpRequest();
      formdata.append('image' + pos, $file);
      xhr.open('post', this.api + 'add?action=image');
      xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
          let json = JSON.parse(xhr.responseText);
          if(json.flag) {
           this.$refs.md.$img2Url(pos, this.api + 'articles/art_imgs/' + json.url);
           this.imgs.push(json.url);
          }else{
            alert(json.reason);
          }
        }
      };
      xhr.withCredentials = true;
      xhr.send(formdata);
     },
     submit() {

       var $checked = $('.checked');
       if($checked.length == 0) {
         return alert('请选择文章分类！');
       }else if (this.title.replace(/[\r\n]/g, "").trim().length == 0 || this.value.replace(/[\r\n]/g, "").trim().length == 0) {
         return alert('标题和文章内容不得为空！');
       }
       var $imgs = $('.v-show-content img');
       var hrefs = [];
       $imgs.each(function(index, val) {
         var index = val.src.lastIndexOf('/') + 1;
         hrefs.push(val.src.substring(index));
       });
       var toDelImgs = [];
       for(let i = 0, len = this.imgs.length; i < len; i ++) {
         if(hrefs.indexOf(this.imgs[i]) == -1) {
           toDelImgs.push(this.imgs[i]);
         }
       }
       var info = {
         type: $checked.text(),
         title: this.title,
         value: this.value,
         timer: Date.now(),
         'toDelImgs': toDelImgs
       };
       console.log(info)
       $.ajax({
         type: 'post',
         data: info,
         url: this.api + 'add?action=article',
         success: (json) => {
          if(json.flag) {
            this.id = json.article_id;
            this.published = true;
          }else{
            alert('发布失败');
          }
        },
        xhrFields: {
          withCredentials: true
        }
       });
     }
  },
  mounted() {
    $('title').text('写文章-WB');
    $('.option span').click(function(){
      $(this).addClass('checked').siblings().removeClass('checked');
    });
    $.ajax({
      method: "get",
      url: this.api + "login",
      xhrFields: {
        withCredentials: true
      },
      success: (data) => {
        if (data.status === "success") {
          this.name = data.name;
          this.portrait = this.api + data.image;
        }else{
          this.$router.push('/login');
        }
      }
    });
    $("html").click(() => {
      var $target = $(event.target);
      if(
        !( $target.isChildAndSelfOf(".option") || $target.isChildAndSelfOf("#publish")) && this.flag
      ) {
        this.flag = false;
      }
    });
  }
};
</script>
<style scoped>
.option p {margin-bottom: 10px;}
.tip-box > span, .tip-box > a {color: #ddd;}
.icon-slide-up { background-image: url(../../../assets/up.svg);}
.icon-slide-down { background-image: url(../../../assets/down.svg);}
.icon-slide-down, .icon-slide-up, .tip-box > :nth-child(3), .option span {cursor: pointer;}
.tip-box > :nth-child(3), .option span:hover , .option .checked, button {color: #007fff;}
.tip-box > :nth-child(3), .tip-box > span, .tip-box > a, .tip-box :first-child {font-size: 1.5em;}
.portrait-part, .icon-slide-down, .icon-slide-up, .tip-box, .tip-box > a, .option span, input {display: inline-block;}
.icon-slide-down, .icon-slide-up {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  background-size: cover;
  background-position: center;
}
.tip-box > a {
  padding: 3px 5px;
  margin-right: 20px;
  border: 1px solid #ddd;
}
.tip-box {
  top: 50%;
  right: 10px;
  user-select: none;
  position: absolute;
  transform: translate(0, -50%);
}
.option {
  right: 0;
  top: 49px;
  color: #949ba5;
  padding: 30px 40px;
  position: absolute;
  border: 1px solid #ddd;
  background-color: white;
}
.option span {
  margin: 3px;
  color: #969696;
  padding: 5px 8px;
  border: 1px solid #ddd;
}
.option span:hover ,.option .checked{
  border-color: #cee6ff;
  background-color: #f2f8ff;
}
.option p:first-child {
  font-size: 2em;
  font-weight: bold;
}
button {
  margin: auto;
  display: block;
  margin-top: 40px;
  background: none;
  padding: 8px 20px;
  border: 1px solid #007fff;
}
#editor {
  width: 100%;
  height: 100%;
  margin: auto;
  margin-top: -50px;
  position: fixed;
  box-sizing: border-box;
  background-color: white;
}
input {
  width: 60%;
  border: none;
  height: 100%;
  outline: none;
  font-size: 2.2em;
  font-weight: bold;
}
.title {
  padding: 20px 0;
  min-width: 600px;
  position: relative;
  border: 1px solid #dbdbdb;
}
</style>