<template>
    <div id="home">
      <user-mode class="user-bar" />
      <!-- <tourist-mode class="tourist-bar"/> -->
      <side-bar class="side-bar" />
    </div>         <!-- #home -->
</template>



<script>
import UserMode from './userMode/UserMode';
import SideBar from './publicComponent/SideBar'
import TouristMode from './touristMode/TouristMode';
export default {
    name: 'home',
    data() {
      return {
        
      }
    },
    components: {
      userMode: UserMode,
      sideBar: SideBar,
      touristMode: TouristMode
    }
}
</script>


<style scoped>
#home {
  width: 960px;
  margin: 100px auto;
  white-space: nowrap;
}
.side-bar, .user-bar, .tourist-bar {
  
  display: inline-block;
}
.side-bar {
  width: 240px;
}
.user-bar, .tourist-bar {
  width: 700px;
}
</style>