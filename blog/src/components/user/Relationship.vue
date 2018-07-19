<template>
  <div class="relationship">
    <ul>
      <li>关注我的</li>
      <li v-for="(item, index) in fans" :key="index">
          <p>
            <img :src="$store.getters.getApi(item.image)" class="portrait">
            <span>{{item.name}}</span>
          </p>
      </li>
    </ul>
    <ul>
      <li>我的关注</li>
      <li v-for="(item, index) in follows" :key="index">
        <p>
          <img :src="$store.getters.getApi(item.image)" class="portrait">
          <span>{{item.name}}</span>
          <button class="focus">{{status}}</button>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    name: 'relationship',
    data() {
        return {
            status: '已关注',
            fans: {},
            follows: {}
        };
    },
    mounted() {
      $.ajax({
        url: this.$store.getters.getApi('api?require=relationship'),
        success: json => {
          this.fans = json.fans;
          this.follows = json.follow;
        },
        xhrFields: { withCredentials: true }
      });
    }
}
</script>

<style scoped>

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