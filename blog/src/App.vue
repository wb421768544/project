<template>
  <div id="all">
    <top-bar></top-bar>
    <router-view></router-view>
    <footer-bar></footer-bar>
    <BackTop />
  </div>
</template>

<script>
import $ from "jquery";
import TopBar from "./components/bar/TopBar";
import FooterBar from "./components/bar/Footer";

import BackTop from '@/components/back-top.vue';

$("html").click(() => {
  var $target = $(event.target);
  if (
    !( $target.isChildAndSelfOf(".list") || $target.isChildAndSelfOf("#portrait") )
  ) {
    $(".list").css("display", "none");
  }
});
$.fn.isChildAndSelfOf = function(b) {
  return this.closest(b).length > 0;
};

export default {
  name: "App",
  components: {
    BackTop,
    "top-bar": TopBar,
    "footer-bar": FooterBar
  }
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
}
a,
button,
img {
  border: none;
  outline: none;
  cursor: pointer;
  text-decoration: none;
}
a {
  color: black;
}
body {
  background-size: cover;
  background-color: #f4f5f5;
  background-repeat: no-repeat;
}
html {
  height: 100%;
  min-width: 350px;
  overflow-y: scroll;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.router-link-active {
  color: inherit;
  text-decoration: none;
}
.v-note-panel {
  border: none!important;
}
.v-show-content {
  background: #fff!important;
}
.article-area {
  white-space: pre-wrap!important;
}
.v-note-show {
  overflow-y: hidden!important;
}
</style>