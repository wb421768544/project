<template>
    <form id="signup">
        <h2>欢迎加入 WB <span>Blob</span></h2>
        <p v-for="(item, index) in info" :key="index">
            <label>{{item.name + ":"}}</label>
            <span class="reason">{{item.reason}}</span><br>
            <input  :name="item.key"
                    :type="item.type" 
                    v-model="value[index]" 
                    :placeholder="item.placeholder"
                    @blur="check(index)">
            <span :class="{flag:item.reason}">*</span>
        </p><br>
        <button @click="submit($event)" type="button">确认提交</button>
    </form>
</template>

<script>
import { mapGetters } from "vuex";
class Information{
  constructor(name, placeholder, key, type = 'text') {
    this.name = name;
    this.type = type;
    this.placeholder = placeholder;
    this.reason = '';
    this.key = key;
  }
}
export default {
  name: "SignUp",
  data() {
    return {
      info: [
        new Information('用户名', 'choose your user name', 'id'),
        new Information('昵称', 'enter your nickname', 'name'),
        new Information('密码', 'enter your password', 'password', 'password'),
        new Information('电话号码', 'enter your phone number', 'phone'),
        new Information('邮箱', 'enter your email', 'eMail' , 'email')
      ],
      value: ["", "", "", "", ""]
    };
  },
  methods: {
    check(index) {
      switch (index) {
        case 0:
          this.user();
          return;
        case 1:
          this.nickname();
          return;
        case 2:
          this.password();
          return;
        case 3:
          this.phone();
          return;
        case 4:
          this.email();
          return;
        default:
      }
      this.user();
      this.nickname();
      this.password();
      this.phone();
      this.email();
    },
    user() {
      let userName = this.value[0].trim();
      if(userName == '') {
        this.info[0].reason = '请输入用户名';
      }else if(!/^.{6,16}$/.test(userName)) {
        this.info[0].reason = '用户名长度必须为6~16';
      }else if(!/(?=.*[_0-9a-z])^[_0-9a-z]{6,16}$/.test(userName)) {
        this.info[0].reason = '用户名只能含有小写字母、数字和下划线';
      }else if(/^(?=[\d]{1})/.test(userName)) {
        this.info[0].reason = '用户名不能以数字开头';
      }else{
        this.info[0].reason = '';
        $.ajax({
          type: "get",
          url: this.getApi(`signup?action=id&val=${userName}`),
          success: json => {
            if (!json.flag) {
              this.info[0].reason = "用户名已存在";
            }
          }
        });
      }
    },
    nickname() {
      var nick = this.value[1].trim();
      if (nick == '') {
        this.info[1].reason = '请输入昵称';
      } else if (nick.length > 16) {
        this.info[1].reason = '昵称长度不能超过16';
      } else if(!/^[\S]{1,16}$/.test(nick)) {
        this.info[1].reason = '昵称不能含有空格';
      } else {
        this.info[1].reason = '';
      }
    },
    password() {
      var len = this.value[2].length;
      if (len < 6 || len > 16) {
        this.info[2].reason = "密码长度为6~16";
      } else {
        this.info[2].reason = "";
      }
    },
    phone() {
      if(/[\d]{11}/.test(this.value[3])) {
        this.info[3].reason = "";
      }else {
        this.info[3].reason = "请输入正确的手机号码";
      }
    },
    email() {
      let email = this.value[4].trim();
      if (email == '') {
        this.info[4].reason = "请输入邮箱";
      } else if(!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)) {
        this.info[4].reason = '请输入正确的邮箱';
      }else {
        this.info[4].reason = '';
      }
    },
    submit() {
      var info = this.info;
      var flag = this.value.every((val, index) => {
        if (val != "" && info[index].reason == "") {
          return true;
        }
        return false;
      });
      if (!flag) {
        this.check();
      } else {
        let data = {};
        this.info.forEach((val, index) => {
          data[val.key] = this.value[index];
        });
        $.ajax({
          type: 'post',
          url: this.getApi("signup?action=submit"),
          data,
          success: json => {
            if (json.flag) {
              alert("注册成功");
              this.$router.push("/");
            } else {
              alert("暂时无法注册。。。");
            }
          }
        });
      }
    }
  },
  computed: mapGetters(["getApi"]),
  mounted() {
    $("body").css(
      "background-image",
      "url(http://www.huoming.com/d/file/banquan/ruanzhu/2017-10-24/9ff6612eedbe78eb54a465d604ec8ca2.jpg)"
    );
  },
  destroyed() {
    $("body").css("background-image", "url()");
  }
};
</script>

<style scoped>
#signup {
  width: 500px;
  padding: 30px 0px;
  background-color: #f5f5f5;
  text-align: center;
  border-radius: 10px;
  margin: 5% auto 0 auto;
}
h2 {
  width: 70%;
  display: inline-block;
  padding-bottom: 20px;
  border-bottom: 3px gray dotted;
  margin-bottom: 30px;
}
h2 span {
  color: #f44d61;
}
p {
  box-sizing: border-box;
  display: inline-block;
  text-align: left;
  margin-bottom: 10px;
  width: 70%;
}
input {
  padding: 8px 7px;
  font-size: 1em;
  width: 90%;
  margin-top: 12px;
  outline: 2px solid #f5f5f5;
  border: 2px solid #f5f5f5;
  border-radius: 5px;
}
button {
  border-radius: 4px;
  background-color: #f44d61;
  border: none;
  font-weight: bold;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
}
.reason {
  margin-left: 50px;
  font-size: 0.8em;
}
.flag,
.reason {
  color: red;
}
</style>