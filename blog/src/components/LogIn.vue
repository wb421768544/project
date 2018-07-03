<template>
    <form :action="$store.getters.getApi('login')" method="POST">
        <h2>账号登陆 &nbsp; <span>Blog</span></h2>
        <p v-for="(item, index) in info" :key="index">
            <label>{{item.name + ":"}}</label>
            <span class="reason">{{item.reason}}</span><br>
            <input class="user-info" :name="item.key" :type="item.type"  v-model="value[index]" :placeholder="item.placeholder" />
        </p><br>
        <button @click="submit" type="submit">登录</button><br>
        <span>还没有账号？<a href="./signin.html">注册</a></span>
        <a href="">忘记密码</a>
    </form>
</template>

<script>
export default {
    name: 'LogIn',
    data() {
        return {
            info:[
                {name:"用户名",type:"text",placeholder:"请输入用户名",key:"id",reason:""},
                {name:"密码",type:"password",placeholder:"请输入密码",key:"password",reason:""}
            ],
            psw:"",
            flag:"用户名",
            value:["",""],
            imgHref: 'http://www.huoming.com/d/file/banquan/ruanzhu/2017-10-24/9ff6612eedbe78eb54a465d604ec8ca2.jpg'
        };
    },
    methods:{
        submit() {
            event.preventDefault();
            if(this.value[0].trim().length == 0) {
              return alert('请输入用户名');
            }
            if(this.value[1].trim().length == 0){
              return alert('请输入密码');
            }
            $.ajax({
              url: this.$store.getters.getApi('login'),
              method: 'POST',
              success: (data) => {
                  if(data.flag){
                      this.info[0].reason = "";
                      if(history.length != 0) {
                        this.$router.push('/');
                      }else{
                        this.$router.push('/');
                      }
                      location.reload();
                  }else{
                      this.info[0].reason = data.reason;
                  }
              },
              data: "login=true&id=" + this.value[0] + "&password=" + this.value[1],
              xhrFields:{withCredentials:true}
            });
        }
    },
    mounted() {
        $("body").css("background-image",'url(' + this.imgHref + ')');
    },
    destroyed() {
        $("body").css("background-image",'url()');
    }
}
</script>

<style scoped>
form {
    width:500px;
    margin: 9% auto;
    padding: 30px 0px;
    text-align: center;
    border-radius: 10px;
    background-color: #f4f5f5;
    box-shadow: 0 0 30px rgb(192, 150, 235);
}
h2 {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 3px gray dotted;
}
h2, p{
    width: 70%;
    display: inline-block;
}
p{
    text-align: left;
    margin-bottom: 10px;
    box-sizing: border-box;
}
.user-info {
    width: 90%;
    font-size: 1em;
    margin-top:12px;
    padding: 8px 7px;
    border-radius: 5px;
    background-color: white;
    border: 2px solid #f5f5f5;
    outline: 2px solid #f5f5f5;
}
button {
    width: 50%;
    border: none;
    color:white;
    border-radius: 4px;
    padding: 10px 20px;
    font-weight: bold;
    margin-bottom: 15px;
    background-color: #007fff;
}
.reason{
    font-size: 0.8em;
    margin-left: 50px;
}
.flag, .reason{
    color:red;
}
a, h2 span{
    color: #007fff;
}
form > span{
    float: left;
    margin-left: 70px;
}
form > span + a {
    float: right;
    margin-right: 70px;
}
</style>