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
  <div>
    <button @click="queryCurrSummonerInfo">查询当前召唤师信息</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import request from '../utils/request.js';

const horseInfo = ref(null);
const summonerName = ref('');

const queryHorse = async () => {
    try {
        const cleanName = summonerName.value.replace(/[\u2066-\u2069]/g, '');
        const response = await request.post('/v1/horse/queryBySummonerName', {
            summonerName: cleanName
        });
        horseInfo.value = response.data;
    } catch (error) {
        console.error('请求出错:', error);
    }
};

const queryCurrSummonerInfo = async () => {
  try{
    const response = await request.get('/v1/user/GetCurrSummonerInfo');
    summonerInfo.value = response.data;
  } catch (error) {
    console.error('<UNK>:', error);
  }
}
</script>