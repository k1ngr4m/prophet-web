<script setup>
import { ref, onMounted } from 'vue';
import request from '../utils/request.js';

const summonerName = ref('');
const summonerInfo = ref(null);

onMounted(() => {
  queryCurrSummonerName();
});

const querySummonerInfo = async () => {
  try {
    const response = await request.post('/v1/summoner/queryByName/info', {
      name: summonerName.value
    });
    summonerInfo.value = response.data.data; // 注意这里也要调整
  } catch (error) {
    console.error('请求出错:', error);
    alert('查询召唤师信息失败，请重试');
  }
};

const queryCurrSummonerName = async () => {
  try {
    const response = await request.get('/v1/getCurrSummoner');
    console.log('完整响应:', response); // 调试用

    // 检查响应结构（现在数据在 response.data.data 里）
    if (response.data && response.data.code === 0 && response.data.data?.summonerName) {
      summonerName.value = response.data.data.summonerName;
      console.log('当前召唤师信息:', summonerName.value);

      // 如果有召唤师名称，则查询详细信息
      if (summonerName.value) {
        await querySummonerInfo();
      }
    } else {
      console.error('响应数据结构不符合预期或请求失败:', response.data);
      alert('无法获取召唤师信息，请检查客户端状态');
    }
  } catch (error) {
    console.error('获取召唤师信息失败:', error);
    alert('无法获取召唤师信息，请检查客户端状态');
  }
};
</script>