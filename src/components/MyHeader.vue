<template>
<div class="weather">
  <iframe allowtransparency="true" frameborder="0" width="255" height="98" scrolling="no" src="//tianqi.2345.com/plugin/widget/index.htm?s=2&z=1&t=1&v=0&d=1&bd=0&k=000000&f=400080&ltf=009944&htf=cc0000&q=1&e=1&a=1&c=58362&w=255&h=98&align=left"></iframe>
  <div class="login-user">欢迎回来^-^</br><span>leetone123</span></div>
</div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<style scoped>
.weather{
  min-width: 230px;
  height: 98px;
}
.weather iframe{
  float: left;
}
.login-user{
  padding-right: 20px;
  padding-top: 30px;
  float: right;
}
</style>
