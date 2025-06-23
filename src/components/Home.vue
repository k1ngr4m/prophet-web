<template>
  <div>
    <h1>LOL 对局先知前端</h1>
    <input 
      type="text" 
      class="summoner-input" 
      v-model="summonerName" 
      placeholder="输入召唤师名称" 
    />
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
const summonerName = ref('');

const queryHorse = async () => {
  try {
    const response = await request.post('/v1/horse/queryBySummonerName', {
      summonerName: summonerName.value
    });
    horseInfo.value = response.data;
  } catch (error) {
    console.error('请求出错:', error);
  }
};

</script>