<template>
  <i @click="backToTop" />
</template>

<script>
export default {
  methods: {
    backToTop() {
      document.documentElement.scrollIntoView();
    },
  },
};
</script>

<style scoped>
i {
  position: fixed;
  bottom: 40px;
  right: 30px;;
  width: 2em;
  height: 2em;
  transform: translateZ(0);
  border-radius: 25px;
  box-shadow: 0 0 8px rgba(0,0,0,.05);
  background: url(../assets/top.svg) no-repeat center;
  background-size: cover;
}
</style>
