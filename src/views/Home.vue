<template>
  <div>
    <div v-if="summonerInfo">
      <h2>召唤师信息</h2>
      <pre>{{ summonerInfo }}</pre>
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

// 页面加载时自动查询召唤师信息
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
    summonerName.value = response.data.summonerName;
    summonerInfo.value = response.data;

    // 调用查询召唤师详细信息
    await querySummonerInfo();

    // 控制台输出以便调试
    console.log('召唤师信息:', summonerInfo.value);
  } catch (error) {
    console.error('获取召唤师信息失败:', error);
    alert('无法获取召唤师信息，请检查客户端状态');
  }
}
</script>