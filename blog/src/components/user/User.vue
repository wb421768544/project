<template>
    <div id="container">
        <article class="article">
            <nav class="menu-bar">
                <div>
                    <img :src="imgSrc">
                    <span>{{authorInfo.name}}</span>
                    <button>编辑个人资料</button>
                </div>
                <ul>
                    <li @click="blog">我的博客</li>
                    <li @click="star">我的收藏</li>
                    <li @click="information">我的资料</li>
                    <li @click="relationship">我的关系</li>
                </ul>
            </nav>
            <blog-star  :arr="[articleInfo, stars]" :author="authorInfo.name" :show="show" :href="href" />
            <self-information :self-infor="selfInfor" :icon="href[2]" v-if="show[2]" :imgSrc="imgSrc" />
            <relationship :arr="[fans, follows]" :api="api" v-if="show[3]" />
        </article>
        <div class="side-bar">
          <div class="rs">
              <span>关注了</span><br>
              <span>{{(len[0])}}</span>
          </div>
          <div class="rs">
              <span>关注者</span><br>
              <span>{{(len[1])}}</span>
          </div>
        </div>
    </div>
</template>


<script>
import BlogStar from './BlogStar'
import Relationship from './Relationship'
import SelfInformation from './Information'
import parseCookie from '@/methods/parseCookie';


var api = "http://" + location.hostname + ':8080' + "/api?require=";
var icon = [
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHRpdGxlPkNBQ0Y5MUY0LTc2RUItNDFENS1CRjZELTdCNTBGNUY4NjUwNTwvdGl0bGU+PGRlZnM+PHJlY3QgaWQ9ImEiIHk9IjU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMjUiIHJ4PSIxIi8+PG1hc2sgaWQ9ImIiIHg9IjAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIyNSIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmPSIjYSIvPjwvbWFzaz48L2RlZnM+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTkgLTU2KSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48dXNlIHN0cm9rZT0iI0VERUVFRiIgbWFzaz0idXJsKCNiKSIgc3Ryb2tlLXdpZHRoPSIyIiB4bGluazpocmVmPSIjYSIvPjxwYXRoIGQ9Ik0xOS4wNSA2Mi43OTdjLS4yMDgtLjI2OC0xLjc3Ni0yLjE4OC0zLjYyOS0xLjcyNS0uNjYyLjE2NS0xLjQzOS40NC0yLjAwOSAxLjQ2My0yLjE4IDMuOTEzIDQuOTY1IDguOTgzIDUuNjE1IDkuNDMzVjcybC4wMjMtLjAxNi4wMjMuMDE2di0uMDMyYy42NS0uNDUgNy43OTUtNS41MiA1LjYxNS05LjQzMy0uNTctMS4wMjMtMS4zNDctMS4yOTgtMi4wMDktMS40NjMtMS44NTMtLjQ2My0zLjQyIDEuNDU3LTMuNjI5IDEuNzI1eiIgZmlsbD0iI0IyQkFDMiIvPjwvZz48L3N2Zz4=",
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+ODlBMTEzNzItNkU2Qy00MkVFLTk5RTYtNDU1MTVDQzIyOUJBPC90aXRsZT48cGF0aCBkPSJNMTAuMDUgNi43OTdDOS44NDIgNi41MyA4LjI3NCA0LjYxIDYuNDIxIDUuMDcyYy0uNjYyLjE2NS0xLjQzOS40NC0yLjAwOSAxLjQ2My0yLjE4IDMuOTEzIDQuOTY1IDguOTgzIDUuNjE1IDkuNDMzVjE2bC4wMjMtLjAxNi4wMjMuMDE2di0uMDMyYy42NS0uNDUgNy43OTUtNS41MiA1LjYxNS05LjQzMy0uNTctMS4wMjMtMS4zNDctMS4yOTgtMi4wMDktMS40NjMtMS44NTMtLjQ2My0zLjQyIDEuNDU3LTMuNjI5IDEuNzI1eiIgZmlsbD0iIzFEQzQwMCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+",
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMy43LjIgKDI4Mjc2KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY29uX2VkaXQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IueKtuaAgSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Iui0puaIt+iuvue9rl/plJnor6/mj5DnpLoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NDguMDAwMDAwLCAtNTk3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTQ4LjAwMDAwMCwgNTk3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yMTEiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iI0Q4RDhEOCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuODAxODczNiwzLjcxNDAzODQzIEwxMi4yNzcxMDkxLDIuMTk3MDY2MTUgQzEyLjAxMzAwNDYsMS45MzQzMTEyOCAxMS42MDQ4MTk3LDEuOTM0MzExMjggMTEuMzQwNjUxMiwyLjE5NzA2NjE1IEwxMC4xNDAwODg3LDMuMzkxNTU2OSBMMTIuNjczMzUxMyw1LjkxMTg3MzQyIEwxMy44MDE4NzM2LDQuNjQ1NzEwNjYgQzE0LjA2NjA0MjEsNC4zODI4OTIxNCAxNC4wNjYwNDIxLDMuOTc2ODU2OTYgMTMuODAxODczNiwzLjcxNDAzODQzIEwxMy44MDE4NzM2LDMuNzE0MDM4NDMgWiBNMiwxMS40MTgzMTA3IEwyLDEzLjkzODYyNzMgTDQuNTMzMzI2NTIsMTMuOTM4NjI3MyBMMTEuODY4OTI0Myw2LjU2ODc2MDU3IEw5LjMzNTY2MTc0LDQuMDQ4NDY1MjkgTDIsMTEuNDE4MzEwNyBMMiwxMS40MTgzMTA3IFogTTcuMzYwOTc2OTIsMTIuNjY3ODgxNiBDNi45OTA4NTk0NywxMi42Njc4ODE2IDYuNjkwODQxNDcsMTIuOTY2MzY2NCA2LjY5MDg0MTQ3LDEzLjMzNDU5MjQgQzYuNjkwODQxNDcsMTMuNzAyODE4NCA2Ljk5MDg1OTQ3LDE0LjAwMTMwMzIgNy4zNjA5NzY5MiwxNC4wMDEzMDMyIEM3LjczMTA5NDM3LDE0LjAwMTMwMzIgOC4wMzExMTIzNywxMy43MDI4MTg0IDguMDMxMTEyMzcsMTMuMzM0NTkyNCBDOC4wMzExMTIzNywxMi45NjYzNjY0IDcuNzMxMDk0MzcsMTIuNjY3ODgxNiA3LjM2MDk3NjkyLDEyLjY2Nzg4MTYgTDcuMzYwOTc2OTIsMTIuNjY3ODgxNiBaIE0xMC4wNDE1MTg3LDEyLjY2Nzg4MTYgQzkuNjcxNDAxMjYsMTIuNjY3ODgxNiA5LjM3MTM4MzI1LDEyLjk2NjM2NjQgOS4zNzEzODMyNSwxMy4zMzQ1OTI0IEM5LjM3MTM4MzI1LDEzLjcwMjgxODQgOS42NzE0MDEyNiwxNC4wMDEzMDMyIDEwLjA0MTUxODcsMTQuMDAxMzAzMiBDMTAuNDExNjM2MiwxNC4wMDEzMDMyIDEwLjcxMTY1NDIsMTMuNzAyODE4NCAxMC43MTE2NTQyLDEzLjMzNDU5MjQgQzEwLjcxMTY3NTUsMTIuOTY2MzY2NCAxMC40MTE2MzYyLDEyLjY2Nzg4MTYgMTAuMDQxNTE4NywxMi42Njc4ODE2IEwxMC4wNDE1MTg3LDEyLjY2Nzg4MTYgWiBNMTIuNzIyMDgxOCwxMi42Njc4ODE2IEMxMi4zNTE5NjQ0LDEyLjY2Nzg4MTYgMTIuMDUxOTQ2NCwxMi45NjYzNjY0IDEyLjA1MTk0NjQsMTMuMzM0NTkyNCBDMTIuMDUxOTQ2NCwxMy43MDI4MTg0IDEyLjM1MTk2NDQsMTQuMDAxMzAzMiAxMi43MjIwODE4LDE0LjAwMTMwMzIgQzEzLjA5MjE5OTMsMTQuMDAxMzAzMiAxMy4zOTIyMTczLDEzLjcwMjgxODQgMTMuMzkyMjE3MywxMy4zMzQ1OTI0IEMxMy4zOTIyMTczLDEyLjk2NjM2NjQgMTMuMDkyMTk5MywxMi42Njc4ODE2IDEyLjcyMjA4MTgsMTIuNjY3ODgxNiBMMTIuNzIyMDgxOCwxMi42Njc4ODE2IFoiIGlkPSJTaGFwZS1Db3B5LTYiIGZpbGw9IiMwMDdGRkYiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
];
export default {
    name:"user",
    data() {
        return {
            //My blog module
            len: [],
            authorInfo: {},           //Your own information;
            articleInfo: {},       //Information on your own blog;

            //My star module
            stars:{},                       //Your stared blog information;

            //My information module
            selfInfor: {},

            //My relationship module
            fans: {},                       //Your fans information;
            follows: {},                     //The information of people who you followed;

            //Public module
            api: 'http://' + location.hostname + ':8080/',
            flag: false,
            href: icon,
            src: icon[0],
            imgSrc: '',
            show:[true, false, false, false],               //check each module
        };   
    },
    methods:{
        blog() {
            if(!this.show[0]){
                $.ajax({
                    url:api + "personal",
                    success: this.getData,
                    xhrFields:{withCredentials:true}
                });
                $.ajax({
                    url:api + "stars",
                    success: this.getStar,
                    xhrFields:{withCredentials:true}
                });
                this.show = [true, false, false, false];
                $(".menu-bar li:nth-child(1)").css("color",'#007fff').siblings().css('color', 'black');
            }
        },
        star() {
            if(!this.show[1]){
                $.ajax({
                    url:api + "stars",
                    success: this.getStar,
                    xhrFields:{withCredentials:true}
                });
                this.show = [false, true, false, false];
                $(".menu-bar li:nth-child(2)").css("color",'#007fff').siblings().css('color', 'black');
            }
        },
        information() {
            if(!this.show[2]){
                $.ajax({
                    url:api + "information",
                    success: (json) => {
                        this.selfInfor = json.information;
                    },
                    xhrFields:{withCredentials:true}
                });
                this.show = [false, false, true, false];
                $(".menu-bar li:nth-child(3)").css("color",'#007fff').siblings().css('color', 'black');
            }
        },
        relationship() {
            if(!this.show[3]){
                $.ajax({
                    url:api + "relationship",
                    success: ( json ) => {
                        this.fans = json.fans;
                        this.follows = json.follow;
                    },
                    xhrFields: {withCredentials:true}
                });
                this.show = [false, false, false, true];
                $(".menu-bar li:nth-child(4)").css("color",'#007fff').siblings().css('color', 'black');
            }
        },
        getData( json ) {
            if( !('data' in json) ){
                return ;
            }
            this.authorInfo = json.data;
            this.articleInfo = json.article;
            this.len[0] = this.authorInfo.fans.length;
            this.len[1] = this.authorInfo.follow.length;
            this.imgSrc = this.api + this.authorInfo.image;
            if(Array.isArray(this.stars) && this.flag){
                this.flag = false;
                for(let i = 0, len = this.articleInfo.length; i < len; i ++){
                    for(let j = 0, l = this.stars.length; j < l; j ++){
                        if(this.articleInfo[i].article_id == this.stars[j].article_id){
                            this.articleInfo[i].flag = true;    //已被star的文章做标记
                        }else{
                            this.articleInfo[i].flag = false;
                        }
                    }
                }
            }else if(!this.flag){  //归还flag，下次ajax异步互斥使用
                this.flag = true;
            }
        },
        getStar(json) {
            this.stars = json.stars;
            if(Array.isArray(this.articleInfo) && this.flag){
                this.flag = false;
                this.updateStar();
            }else if(!this.flag){   //归还flag，下次ajax异步互斥使用
                this.flag = true;
            }
        },
        updateStar() {
            for(let i = 0, len = this.articleInfo.length; i < len; i ++){
                for(let j = 0, l = this.stars.length; j < l; j ++){
                    if(this.articleInfo[i].article_id == this.stars[j].article_id){
                        this.articleInfo[i].flag = true;    //已被star的文章做标记
                    }else{
                        this.articleInfo[i].flag = false;
                   }
                }
            }
        }
    },
    mounted() {
        var cookie = parseCookie(document.cookie);
        if(cookie.id){
            let str = this.api + 'login';
            $.ajax({
                method: 'get',
                url:str,
                xhrFields: {
                    withCredentials:true
                },
                success: (data) => {
                    if(data.status === "success"){
                        this.flag = data.flag;
                        this.name = data.name;
                        this.portrait += data.image;
                    }
                }
            });
        }
        var cookie = parseCookie( document.cookie );
        if( cookie.id ){
            $.ajax({
                url:api + "personal",
                success: this.getData,
                xhrFields:{withCredentials:true}
            });
            $.ajax({
                url:api + "stars",
                success: this.getStar,
                xhrFields:{withCredentials:true}
            });
        }
    },
    components: {
        'blog-star': BlogStar,
        'relationship': Relationship,
        'self-information': SelfInformation
    }
};
</script>


<style scoped>
button{
    background-color: transparent;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
.menu-bar {
    font-family: Arial, Helvetica, sans-serif;
    white-space: nowrap;
}
.menu-bar img{
    width:90px;
    height: 90px;
    border-radius: 45px;
    vertical-align: middle;
}
.menu-bar span:nth-child(2) {
    float: none;
    margin: 20px;
    font-size: 1.5em;
    font-weight: bold;
    display: inline-block;
}
.menu-bar button {
    right: 5%;
    bottom: 20%;
    border: 1px solid;
    padding: 10px 20px;
    border-radius: 5px;
    position: absolute;
}
.menu-bar li {
    height: 100%;
    width: 100px;
    padding:20px;
    font-size:12px;
    cursor: pointer;
    margin-top: 10px;
    text-align: center;
    display: inline-block;
    border-bottom: 3px solid;
}
.menu-bar ul{ font-size: 0;}
.menu-bar > div { box-sizing: border-box;}
.menu-bar li:first-child, .menu-bar button { color: #007fff;}
.menu-bar > div, .menu-bar li { background-color: white;}

.menu-bar > div{
    width: 100%;
    padding: 15px 20px;
}
.rs {
  color: #31445b;
    cursor: pointer;
    display: inline-block;
    width: 45%;
    font-size: 2em;
}
.rs:hover :nth-child(3){ text-decoration: underline;}
#container{
    width: 1150px;
    margin: 100px auto 0 auto;
    position: relative;
    white-space: nowrap;
}
.article, .side-bar {
  display: inline-block;
}
.article {
  width: 74%;
}

.side-bar {
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
  background-color: white;
  width: 23%;
  position: absolute;
  right: 0;
}
.rs, .menu-bar > div{ position: relative;}
</style>