<template>
  <div>
    <!-- 输入框和提交按钮 -->
    <div>
      <input
          v-model="inputSummonerName"
          class="summoner-input"
          placeholder="请输入召唤师名称"
      />
      <button @click="submitSummonerName">提交</button>
    </div>
    <!-- 历史记录展示 -->
    <div v-if="history.length > 0">
      <h3>历史输入记录</h3>
      <ul>
        <li v-for="(name, index) in history" :key="index">{{ name }}</li>
      </ul>
    </div>
    <!-- 展示接口返回的结果 -->
    <div v-if="summonerMatchesList.length > 0">
      <h3>召唤师历史数据</h3>
      <table>
        <thead>
        <tr>
          <th>游戏创建时间</th>
          <th>游戏模式</th>
          <th>英雄 ID</th>
          <th>击杀数</th>
          <th>死亡数</th>
          <th>助攻数</th>
          <th>是否获胜</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(match, index) in summonerMatchesList" :key="index">
          <td>{{ match.gameCreationDate }}</td>
          <td>{{ match.gameMode }}</td>
          <td>{{ match.participants[0].championId }}</td>
          <td>{{ match.participants[0].stats.kills }}</td>
          <td>{{ match.participants[0].stats.deaths }}</td>
          <td>{{ match.participants[0].stats.assists }}</td>
          <td>{{ match.participants[0].stats.win ? '获胜' : '失败' }}</td>
        </tr>
        </tbody>
      </table>
    </div>
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
import { ref } from 'vue';
import request from '../utils/request.js';

const summonerName = ref('');
const summonerInfo = ref(null);
const summonerMatchesList = ref([]);
const inputSummonerName = ref('');
const history = ref([]);

const submitSummonerName = async () => {
  const name = inputSummonerName.value.trim();
  if (name) {
    // 添加到历史记录
    if (!history.value.includes(name)) {
      history.value.push(name);
    }
    try {
      const response = await request.post('/v1/api/summoner/matches/list', {
        name: name,
      });
      summonerMatchesList.value = response.data.result;
    } catch (error) {
      console.error('请求出错:', error);
      alert('查询召唤师历史数据失败，请重试');
    }
  }
};
</script>

<style scoped>
/* 可以根据需要添加样式 */
.summoner-input {
  padding: 8px 12px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 250px;
}

button {
  padding: 8px 16px;
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #3a5bd9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>