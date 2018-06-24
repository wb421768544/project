<template>
    <form id="signup" :action="url + '/signin.js'" method="POST">
        <h2>欢迎加入 WB <span>Blob</span></h2>
        <p v-for="(item, index) in info" :key="index">
            <label>{{item.name + ":"}}</label>
            <span class="reason">{{item.reason}}</span><br>
            <input  :name="item.key"
                    :type="item.type" 
                    v-model="value[index]" 
                    :placeholder="item.placeholder"
                    @blur="check(index)"
                    >
            <span :class="{flag:item.reason}">*</span>
        </p><br>
        <button @click="submit" type="submit">确认提交</button>
    </form>
</template>

<script>
export default {
    name: 'SignUp',
    data() {
        return {
            info:[
                {name:"用户名",type:"text",placeholder:"choose your user name",reason:"",key:"id"},
                {name:"昵称",type:"text",placeholder:"enter your nickname",reason:"",key:"name"},
                {name:"密码",type:"password",placeholder:"enter your password",reason:"",key:"password"},
                {name:"电话号码",type:"text",placeholder:"enter your phone number",reason:"",key:"phone"},
                {name:"邮箱",type:"email",placeholder:"enter your email",reason:"",key:"eMail"}
            ],
            value:["", "", "", "", ""],
            url: 'http://' + location.hostname + ':8080',
            imgHref: 'http://www.huoming.com/d/file/banquan/ruanzhu/2017-10-24/9ff6612eedbe78eb54a465d604ec8ca2.jpg'
        }
    },
    methods:{
        check() {
            this.user();
            this.nickname();
            this.password();
            this.phone();
            this.email();
        },
        user() {
            var letter = this.value[0].charAt(0),
                   len = this.value[0].length;
            if(len < 9 || len > 16){
                if(len == 0){
                    this.info[0].reason = "请输入用户名";
                }else{
                    this.info[0].reason = "用户名长度为9~16";
                }
            }else if(letter < 'A' || letter > 'z' && letter != '_'){
                this.info[0].reason = "首字符必须是字母或下划线";
            }else{
                this.info[0].reason = "";
            }
            if(this.info[0].reason == "" && this.value[0] != ""){//发送ajax，检查id是否已经存在
                $.ajax({
                    method: 'post',
                    url: this.url + '/signin.js',
                    success: (data) => {
                        data = JSON.parse(data);
                        if(!data.flag){
                            this.info[0].reason = '用户名已存在';
                        }
                    },
                    data: 'id=' + this.value[0] + "&check=true",
                    xhrFields:{withCredentials:true}
                });
            }
        },
        nickname() {
            var nick = this.value[1];
            if(nick.length == 0){
                this.info[1].reason = "请输入昵称";
            }else if(nick.length > 16){
                this.info[1].reason = "昵称长度不能超过16";
            }else{
                this.info[1].reason = "";
            }
        },
        password() {
            var len = this.value[2].length;
            if(len < 6 || len > 16){
                this.info[2].reason = "密码长度为6~16";
            }else{
                this.info[2].reason = "";
            }
        },
        phone() {
            if(this.value[3].length != 11){
                this.info[3].reason = "请输入正确的手机号码";
            }else{
                this.info[3].reason = "";
            }
        },
        email() {
            if(this.value[4] == ""){
                this.info[4].reason = "请输入邮箱";
            }else{
                this.info[4].reason = "";
            }
        },
        submit() {
            var info = this.info;
            var flag = this.value.every( (val, index) => {
                if(val != "" && info[index].reason == ""){
                    return true;
                }
                return false;
            });
            if(!flag){
                event.preventDefault();
                this.check();
            }
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
h2 span{
    color:#f44d61;
}
p{
    box-sizing: border-box;
    display: inline-block;
    text-align: left;
    margin-bottom: 10px;
    width: 70%;
}
input{
    padding: 8px 7px;
    font-size: 1em;
    width: 90%;
    margin-top:12px;
    outline: 2px solid #f5f5f5;
    border: 2px solid #f5f5f5;
    border-radius: 5px;
}
button {
    border-radius: 4px;
    background-color: #f44d61;
    border: none;
    font-weight: bold;
    color:white;
    padding:10px 20px;
    cursor: pointer;
}
.reason{
    margin-left: 50px;
    font-size: 0.8em;
}
.flag, .reason{
    color:red;
}
</style>