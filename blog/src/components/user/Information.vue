<template>
  <div class="info">
    <p>
      头像:
      <img :src="imgSrc" class="portrait" @click="changeImg">
    </p>
    <p>
      皮肤:<span></span>
    </p>
    <p>
      我的用户名:
      <input type="text" :value="selfInfor.id" disabled="true">
    </p>
    <p>
      我的昵称:
      <img src="@/assets/modify-pen.svg" class="icon-pen">
      <input type="text" :value="selfInfor.name" disabled="true">
    </p>
    <p>
      绑定的手机:
      <input type="text" :value="selfInfor.phone" disabled="true">
    </p>
    <p>
      绑定的邮箱:
      <input type="text" :value="selfInfor.eMail" disabled="true">
    </p>
    <div v-if="!flag" id="file">
      <div>
        <article id="upload" @change="submit">
          <form id="form">
              <input type="file" name="portrait">
          </form>
          <span>
              <img src="@/assets/icon-img.png" class="icon-img">
              选择头像
          </span>
        </article>
        <div id="select-container">
          <img src="" class="src-img">
          <canvas id="temp" height="150" width="150"></canvas>
          <div id="select"></div>
        </div>
        <canvas id="final" height="200" width="200"></canvas>
        <button class="btn-file" @click="save">保存</button>
        <button class="btn-file" @click="none">取消</button>
      </div>
    </div>
  </div>  <!-- info -->
</template>

<script>
import Move from "@/methods/move";
export default {
  data() {
    return {
      src: "",
      flag: false,
      api: "http://" + location.hostname + ":8080/"
    };
  },
  props: ["selfInfor", "imgSrc"],
  methods: {
    changeImg() {
      $("#file").css("display", "block");
    },
    none() {
      $("#file").css("display", "none");
    },
    submit() {
      var reader = new FileReader();
      var file = $("#form input")[0].files[0];
      if (!/image/.test(file.type)) {
        alert("请上传图片");
      } else {
        $(".src-img")[0].src = URL.createObjectURL(file);
      }
    },
    save() {}
  },
  mounted() {
    var self = this;
    $(".icon-pen").click(function() {
      $(this).next().attr("disabled", false).change(() => {
        $.ajax({
          url: self.api + "submit?action=name&name=" + $(this).next().val(),
          type: "get",
          success(json) {
            if (json.flag) {
              alert("修改成功");
              location.reload();
            } else {
              alert("修改失败");
            }
          },
          xhrFields: { withCredentials: true }
        });
      });
    });
    var select = $("#select")[0];
    var img = $("#select-container img")[0];
    Move(select, img);
  }
};
</script>


<style scoped>
input {
  font-size: 1.1em;
}
.icon-img {
  height: 1.5em;
  width: 1.5em;
  margin-right: 5px;
  vertical-align: middle;
}
#file {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
#file > div {
  height: 400px;
  width: 600px;
  margin: 0 auto;
  margin-top: 80px;
  background-color: white;
}
#file div,
#upload {
  position: relative;
}
input[name="portrait"],
#upload span {
  position: absolute;
}
input[name="portrait"] {
  top: 0;
  left: 0;
  opacity: 0;
  width: 100px;
  height: 100%;
  z-index: 2;
}

#upload span {
  line-height: 1em;
  width: 100px;
}
#upload {
  top: 30px;
  left: 40px;
  padding: 15px 0;
  cursor: pointer;
}
#upload span {
  padding: 5px 0;
  margin: 0;
  font-weight: bold;
  text-align: center;
  top: 0px;
  left: 0px;
  z-index: 1;
}
#upload span,
.btn-file {
  color: white;
  border-radius: 3px;
  background: linear-gradient(to right, #38a8ff, #3875ff);
}
.btn-file {
  padding: 2px 4px;
  margin-top: 200px;
  bottom: 50px;
  position: absolute;
}
.btn-file:nth-child(4) {
  right: 150px;
}
.btn-file:nth-child(5) {
  right: 100px;
}
#final {
  border: 1px solid red;
  position: absolute;
  top: 80px;
  right: 100px;
}
#temp {
  border: 1px solid red;
}
.src-img {
  /* height: 150px; */
  max-height: 200px;
  width: 150px;
  box-sizing: border-box;
}
#select-container {
  box-sizing: border-box;
  height: 150px;
  width: 150px;
  margin-left: 30px;
  margin-top: 70px;
}
#select {
  border: 4px solid rgba(128, 128, 128, 0.87);
  width: 140px;;
  height: 150px;
  position: absolute;
  top: 0;
  left: 0;
}
#select:active {
  cursor: move;
}
.info {
  background-color: white;
  font-size: 1.5em;
  position: relative;
}
p {
  line-height: 50px;
  padding: 20px 100px;
  border: 1px solid #f7f8fa;
  position: relative;
}
.icon-pen,
input,
.portrait {
  position: absolute;
  top: 37px;
}
.icon-pen {
  right: 250px;
}
input {
  right: 400px;
}
.portrait {
  height: 4em;
  width: 4em;
  border-radius: 2em;
  right: 500px;
  top: 16px;
}
</style>