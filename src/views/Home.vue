<template>
    <div>
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
        <!-- 显示召唤师信息 -->
        <div v-if="summonerInfo">
            <h2>当前召唤师信息</h2>
            <pre>{{ summonerInfo }}</pre> <!-- 实际使用时建议结构化展示 -->
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // 1. 引入 onMounted
import request from '../utils/request.js';

const horseInfo = ref(null);
const summonerName = ref('');
const summonerInfo = ref(null); // 2. 定义存储召唤师信息的响应式变量

// 3. 页面加载时自动执行
onMounted(() => {
    queryCurrSummonerInfo();
});

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
    try {
        const response = await request.get('/v1/user/GetCurrSummonerInfo');
        summonerInfo.value = response.data; // 4. 存储数据
        console.log('召唤师信息:', summonerInfo.value);
    } catch (error) {
        console.error('获取召唤师信息失败:', error);
    }
}
</script>