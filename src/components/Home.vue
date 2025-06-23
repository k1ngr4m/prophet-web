<template>
  <div>
    <h1>LOL 对局先知前端</h1>
    <button @click="queryHorse">查询马匹信息</button>
    <div v-if="horseInfo">
      <p>分数: {{ horseInfo.score }}</p>
      <p>马匹: {{ horseInfo.horse }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import request from '../utils/request';

const horseInfo = ref(null);

const queryHorse = async () => {
  try {
    const response = await request.post('/v1/horse/queryBySummonerName', {
      summonerName: '再吃颗电池吧#14276' // 这里需要根据实际情况修改
    });
    horseInfo.value = response.data;
  } catch (error) {
    console.error('请求出错:', error);
  }
};
</script>