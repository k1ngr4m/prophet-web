<!--<template>-->
<!--    <router-view />-->
<!--    <Home />-->
<!--</template>-->

<!--<script setup>-->
<!--import Home from './views/Home.vue';-->
<!--</script>-->
<template>
  <Home />
  <SummonerRecordQuery />
</template>

<script setup>
import Home from './views/Home.vue';
import SummonerRecordQuery from './components/SummonerRecordQuery.vue';
</script>

<style scoped>
/* 这里可以添加全局样式 */
</style>