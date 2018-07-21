<template>
  <div class="relationship">
    <ul>
      <li class="person-after" :class="{'self-after': getUser.id == $parent.userId}">关注</li>
      <li v-for="(item, index) in fans" :key="index">
          <p>
            <img :src="$store.getters.getApi(item.image)" class="portrait">
            <span>{{item.name}}</span>
            <button v-if="isLogin && (getUser.id != item.fan)" class="focus" :class="{focused: selfFollow.indexOf(item.fan) != -1}" @click="focus(item.fan)">关注</button>
          </p>
      </li>
      <li v-if="fans.length == 0" class="empty">
        <p>还没有任何人关注😭😭😭</p>
      </li>
    </ul>
    <ul>
      <li class="person-before" :class="{'self-before': getUser.id == $parent.userId}">关注😶</li>
      <li v-for="(item, index) in follows" :key="index">
        <p>
          <img :src="$store.getters.getApi(item.image)" class="portrait">
          <span>{{item.name}}</span>
          <button v-if="isLogin" class="focus" :class="{focused: selfFollow.indexOf(item.concern) != -1}" @click="focus(item.concern)">关注</button>
        </p>
      </li>
      <li v-if="follows.length == 0" class="empty">
        <p>还没有人关注任何😥😥😥</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'relationship',
    data() {
        return {
            fans: {},
            follows: {},
            selfFollow: []
        };
    },
    methods: {
      focus(id) {
        if(!this.isLogin) {
          return alert('请登录');
        }
        $.ajax({
          url: this.getApi(`api?require=focus&id=${id}`),
          xhrFields:{withCredentials:true},
        }).then(json => {
          if(json.flag) {
            this.selfFollow = json.follow;
          }else {
            throw new Error(json.reason);
          }
        }).catch(err => {
          console.error(err);
        });
      },
      getRelationship() {
        $.ajax({
          url: this.$store.getters.getApi(`api?require=relationship&id=${this.$parent.userId}`),
          success: json => {
            this.fans = json.fans;
            this.follows = json.follow;
            if(this.isLogin) {
              this.selfFollow = json.selfFollow;
            }
          },
          xhrFields: { withCredentials: true }
        });
      }
    },
    mounted() {
      this.getRelationship();
    },
    computed: mapGetters(['getApi', 'getUser', 'isLogin'])
}
</script>

<style scoped>
ul li:first-child {
  font-size: 1.3em;
}
.empty {
  text-align: center;
  font-size: 2em;
  color: bisque;
}
.person-after::after {
  content: '他的😊';
}
.self-after::after {
  content: '我的😊';
}
.person-before::before {
  content: '他的';
}
.self-before::before {
  content: '我的';
}
.focused::before {
  content: '已';
}
.relationship {
    position: relative;
    background-color: white;
}
.relationship p{
    white-space: nowrap;
    line-height: 50px;
    padding:0;
    padding: 20px;
    border: 1px solid #f7f8fa;
}
.relationship img { vertical-align: middle;}
.relationship span { font-size: 2em;}
.focus {
    color: white;
    font-size: 0.8em;
    padding: 9px 25px;
    border-radius: 5px;
    margin-left: 35%;
    background-color: #92c452;
}
.focus:hover { background-color: #a7cf74;}
.focus:active { background-color: #92c452;}
.portrait{
    height:4em ;
    width:4em;
    border-radius: 2em;
    margin:0 30px;
    vertical-align: super;
}
</style>