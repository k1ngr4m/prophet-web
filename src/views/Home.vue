<template>
  <div>
    <div v-if="summonerInfo">
      <pre>{{ summonerInfo }}</pre>
    </div>
    <div v-else-if="summonerName">
      <p>召唤师名称: {{ summonerName }}</p>
    </div>
    <div v-else>
      <p>加载召唤师信息中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '../utils/request.js';

const summonerName = ref('');
const summonerInfo = ref(null);
const summonerMatchesList = ref([])

onMounted(() => {
  queryCurrSummonerName();
});

const querySummonerInfo = async () => {
  try {
    const response = await request.post('/v1/summoner/queryByName/info', {
      name: summonerName.value
    });
    summonerInfo.value = response.data;
  } catch (error) {
    console.error('请求出错:', error);
    alert('查询召唤师信息失败，请重试');
  }
};

const queryCurrSummonerName = async () => {
  try {
    const response = await request.get('/v1/getCurrSummoner');
    console.log('完整响应:', response); // 调试用

    // 检查响应结构
    if (response && response.data) {
      summonerName.value = response.data.summonerName || '';
      console.log('当前召唤师信息:', summonerName.value);

      // 如果有召唤师名称，则查询详细信息
      if (summonerName.value) {
        await querySummonerInfo();
        await updateSummonerMatches();
      }
    } else {
      console.error('响应数据结构不符合预期:', response);
    }
  } catch (error) {
    console.error('获取召唤师信息失败:', error);
    alert('无法获取召唤师信息，请检查客户端状态');
  }
};

const updateSummonerMatches = async () => {
  try {
    const response = await request.post('/v1/api/summoner/matches/list', {
      name: summonerName.value
    });
    summonerMatchesList.value = response.data;
  } catch (error) {
    console.error('请求出错:', error);
    alert('查询召唤师历史数据失败，请重试');
  }
}
</script>