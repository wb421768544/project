<template>
    <div id="home">
      <user-mode v-if="isLogin" class="user-bar" />
      <tourist-mode v-if="!isLogin" class="tourist-bar"/>
      <side-bar class="side-bar" />
    </div>         <!-- #home -->
</template>

<script>
import UserMode from './userMode/UserMode';
import SideBar from './publicComponent/SideBar'
import TouristMode from './touristMode/TouristMode';
import { mapGetters } from 'vuex';
export default {
    name: 'home',
    computed: mapGetters(['isLogin']),
    components: {
      userMode: UserMode,
      sideBar: SideBar,
      touristMode: TouristMode
    },
    mounted() {
      this.$store.commit('setTitle', 'Blog');
    }
}
</script>

<style scoped>
#home {
  width: 99%;
  max-width: 980px;
  margin: 70px auto;
  border-radius: 3px;
  position: relative;
  white-space: nowrap;
}
.side-bar { 
  right: 0;
  position: absolute;
  vertical-align: top;
}
.user-bar, .tourist-bar { width: 700px;}
.side-bar, .user-bar, .tourist-bar { display: inline-block;}
@media only screen and (max-width: 980px) {
    .tourist-bar, .user-bar {
      width: 100%;
    }
}
</style>