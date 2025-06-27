<template>
  <div id="app" class="max-w-6xl mx-auto px-4 py-8">
    <!-- 头部区域 -->
    <header class="mb-10 text-center">
      <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-2 text-secondary text-shadow">
        <i class="fa fa-gamepad mr-3"></i>召唤师战绩查询
      </h1>
      <p class="text-gray-300 text-lg max-w-2xl mx-auto">
        输入召唤师名称，查看最近的比赛记录和详细统计数据
      </p>
    </header>

    <!-- 搜索区域 -->
    <div class="bg-dark/50 rounded-xl p-6 shadow-2xl mb-10 backdrop-blur-sm border border-gray-700/50">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <!-- 输入框和历史记录 -->
        <div class="w-full relative">
          <div class="relative">
            <input
                type="text"
                v-model="searchInput"
                @keyup.enter="searchSummoner"
                placeholder="输入召唤师名称..."
                class="w-full bg-gray-800/70 border border-gray-600 rounded-l-lg py-3 px-4 pr-12 text-light focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 text-lg"
            >
            <button
                @click="toggleHistory"
                class="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-secondary transition-colors"
            >
              <i class="fa fa-history"></i>
            </button>
          </div>

          <!-- 历史记录下拉框 -->
          <div
              v-show="showHistory"
              class="absolute z-10 w-full mt-1 bg-gray-800/95 rounded-lg shadow-xl border border-gray-700 max-h-64 overflow-y-auto transition-all duration-300"
          >
            <ul class="divide-y divide-gray-700">
              <li
                  v-for="(history, index) in searchHistory"
                  :key="index"
                  @click="selectHistory(history)"
                  class="px-4 py-3 hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                <span class="font-medium">{{ history }}</span>
                <button
                    @click.stop="removeHistory(index)"
                    class="ml-2 text-gray-500 hover:text-red-400"
                >
                  <i class="fa fa-times"></i>
                </button>
              </li>
            </ul>
            <div
                v-if="searchHistory.length > 0"
                @click="clearAllHistory"
                class="px-4 py-2 text-center text-sm text-gray-400 hover:bg-gray-700/50 cursor-pointer rounded-b-lg"
            >
              清除所有历史记录
            </div>
          </div>
        </div>

        <!-- 搜索按钮 -->
        <button
            @click="searchSummoner"
            class="bg-secondary hover:bg-secondary/80 text-dark font-bold py-3 px-6 rounded-r-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <i class="fa fa-search mr-2"></i>
          <span>搜索</span>
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent mb-4"></div>
      <p class="text-xl text-gray-300">正在加载数据，请稍候...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="errorMessage" class="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
      <i class="fa fa-exclamation-triangle text-red-400 text-3xl mb-3"></i>
      <h3 class="text-xl font-semibold text-red-300 mb-2">加载失败</h3>
      <p class="text-red-300">{{ errorMessage }}</p>
      <button
          @click="retry"
          class="mt-4 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
      >
        重试
      </button>
    </div>

    <!-- 召唤师信息 -->
    <div v-else-if="summonerInfo" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 基本信息卡片 -->
      <div class="lg:col-span-1 bg-dark/60 rounded-xl p-6 shadow-lg border border-gray-700/50">
        <div class="flex items-center mb-4">
          <img
              :src="`https://ddragon.leagueoflegends.com/cdn/13.23.1/img/profileicon/${summonerInfo.profileIconId}.png`"
              alt="召唤师头像"
              class="w-20 h-20 rounded-full border-2 border-secondary"
          >
          <div class="ml-4">
            <h2 class="text-2xl font-bold text-secondary">{{ summonerInfo.name }}</h2>
            <p class="text-gray-400">等级: {{ summonerInfo.summonerLevel }}</p>
          </div>
        </div>

        <!-- 段位信息 -->
        <div class="bg-gray-800/50 rounded-lg p-4 mb-4">
          <h3 class="text-lg font-semibold mb-2 flex items-center">
            <i class="fa fa-trophy text-accent mr-2"></i>
            排位赛信息
          </h3>
          <div v-if="summonerRankedInfo && summonerRankedInfo.length > 0" class="space-y-3">
            <div v-for="queue in summonerRankedInfo" :key="queue.queueType" class="bg-gray-900/50 rounded p-3">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-300">{{ getQueueTypeName(queue.queueType) }}</span>
                <span class="font-bold text-secondary">{{ queue.tier }} {{ queue.rank }}</span>
              </div>
              <div class="flex justify-between items-center mt-1">
                <span class="text-gray-400">
                  <i class="fa fa-medal text-accent mr-1"></i>
                  {{ queue.leaguePoints }} LP
                </span>
                <span class="text-gray-400">
                  <i class="fa fa-check-circle text-green-400 mr-1"></i>
                  {{ queue.wins }} 胜 {{ queue.losses }} 负
                </span>
              </div>
              <div class="mt-2">
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div
                      class="bg-secondary h-2 rounded-full"
                      :style="{ width: winRate(queue.wins, queue.losses) + '%' }"
                  ></div>
                </div>
                <div class="text-right text-xs text-gray-400 mt-1">
                  胜率: {{ winRate(queue.wins, queue.losses) }}%
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-400 text-center py-2">
            暂无排位赛数据
          </div>
        </div>

        <!-- 基本统计信息 -->
        <div class="bg-gray-800/50 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-3 flex items-center">
            <i class="fa fa-bar-chart text-secondary mr-2"></i>
            近期表现
          </h3>
          <div class="grid grid-cols-2 gap-2 text-center">
            <div class="bg-gray-900/50 rounded p-3">
              <div class="text-2xl font-bold text-accent">{{ recentStats.kdaRatio.toFixed(2) }}</div>
              <div class="text-sm text-gray-400">KDA 比率</div>
            </div>
            <div class="bg-gray-900/50 rounded p-3">
              <div class="text-2xl font-bold text-accent">{{ recentStats.winRate }}%</div>
              <div class="text-sm text-gray-400">胜率</div>
            </div>
            <div class="bg-gray-900/50 rounded p-3">
              <div class="text-2xl font-bold text-accent">{{ recentStats.avgKills.toFixed(1) }}</div>
              <div class="text-sm text-gray-400">场均击杀</div>
            </div>
            <div class="bg-gray-900/50 rounded p-3">
              <div class="text-2xl font-bold text-accent">{{ recentStats.avgCs.toFixed(1) }}</div>
              <div class="text-sm text-gray-400">场均补兵</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 比赛记录区域 -->
      <div class="lg:col-span-2 bg-dark/60 rounded-xl p-6 shadow-lg border border-gray-700/50">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold flex items-center">
            <i class="fa fa-history text-secondary mr-2"></i>
            最近比赛记录
          </h2>
          <div class="flex space-x-2">
            <button
                @click="loadMoreMatches"
                class="bg-gray-800 hover:bg-gray-700 text-light px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <i class="fa fa-refresh mr-2"></i>加载更多
            </button>
            <div class="relative">
              <select
                  v-model="matchFilter"
                  class="bg-gray-800 hover:bg-gray-700 text-light px-4 py-2 rounded-lg transition-colors appearance-none pr-8 focus:outline-none"
              >
                <option value="all">全部</option>
                <option value="win">胜利</option>
                <option value="loss">失败</option>
              </select>
              <i class="fa fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>
        </div>

        <!-- 比赛记录列表 -->
        <div class="space-y-4">
          <div
              v-for="(match, index) in filteredMatches"
              :key="index"
              class="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 hover:border-secondary/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex flex-col md:flex-row">
              <!-- 比赛基本信息 -->
              <div class="md:w-1/4 mb-4 md:mb-0 md:pr-4 border-b md:border-b-0 md:border-r border-gray-700/50">
                <div class="flex justify-between items-center mb-2">
                  <span
                      class="px-2 py-1 rounded-full text-sm font-medium"
                      :class="{ 'bg-green-500/20 text-green-400': match.win, 'bg-red-500/20 text-red-400': !match.win }"
                  >
                    {{ match.win ? '胜利' : '失败' }}
                  </span>
                  <span class="text-gray-400 text-sm">
                    {{ formatTimeAgo(match.gameCreation) }}
                  </span>
                </div>
                <div class="flex items-center">
                  <img
                      :src="getChampionImage(match.championId)"
                      alt="英雄头像"
                      class="w-12 h-12 rounded-lg"
                  >
                  <div class="ml-3">
                    <div class="font-medium">{{ getChampionName(match.championId) }}</div>
                    <div class="text-gray-400 text-sm">
                      {{ match.champLevel }} 级
                    </div>
                  </div>
                </div>
                <div class="mt-3 flex items-center justify-center">
                  <div class="flex space-x-1">
                    <img
                        v-for="(spell, i) in match.spell1Id && match.spell2Id ? [match.spell1Id, match.spell2Id] : []"
                        :key="i"
                        :src="getSummonerSpellImage(spell)"
                        alt="召唤师技能"
                        class="w-6 h-6 rounded"
                    >
                  </div>
                  <div class="flex space-x-1 ml-2">
                    <img
                        v-for="(item, i) in match.items.slice(0, 6)"
                        :key="i"
                        :src="getItemImage(item)"
                        alt="装备"
                        class="w-6 h-6 rounded bg-gray-700/50"
                    >
                  </div>
                </div>
              </div>

              <!-- KDA信息 -->
              <div class="md:w-1/4 p-4 border-b md:border-b-0 md:border-r border-gray-700/50">
                <div class="text-center">
                  <div class="text-2xl font-bold">
                    {{ match.kills }} / {{ match.deaths }} / {{ match.assists }}
                  </div>
                  <div
                      class="text-sm"
                      :class="{ 'text-green-400': match.kdaRatio >= 3, 'text-yellow-400': match.kdaRatio >= 1.5 && match.kdaRatio < 3, 'text-red-400': match.kdaRatio < 1.5 }"
                  >
                    {{ match.kdaRatio.toFixed(2) }} KDA
                  </div>
                </div>
                <div class="mt-4 text-center">
                  <div class="text-sm text-gray-400">参团率</div>
                  <div class="text-lg font-medium">{{ match.teamParticipation.toFixed(1) }}%</div>
                </div>
                <div class="mt-4">
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-400">总伤害</span>
                    <span>{{ formatNumber(match.totalDamageDealtToChampions) }}</span>
                  </div>
                  <div class="flex justify-between items-center text-sm mt-1">
                    <span class="text-gray-400">承伤</span>
                    <span>{{ formatNumber(match.totalDamageTaken) }}</span>
                  </div>
                  <div class="flex justify-between items-center text-sm mt-1">
                    <span class="text-gray-400">治疗</span>
                    <span>{{ formatNumber(match.totalHeal) }}</span>
                  </div>
                </div>
              </div>

              <!-- 游戏详情 -->
              <div class="md:w-2/4 p-4">
                <div class="flex justify-between items-center mb-3">
                  <div class="font-medium">
                    {{ match.gameMode === 'CLASSIC' ? '经典模式' : match.gameMode }}
                  </div>
                  <div class="text-gray-400 text-sm">
                    {{ formatGameDuration(match.gameDuration) }}
                  </div>
                </div>

                <!-- 我方队伍 -->
                <div class="mb-3">
                  <div class="flex items-center mb-1">
                    <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span class="text-sm text-gray-400">我方队伍</span>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center" v-for="(player, i) in match.teamMembers" :key="i">
                      <img
                          :src="getChampionImage(player.championId)"
                          alt="英雄头像"
                          class="w-5 h-5 rounded mr-2"
                      >
                      <span class="text-sm" :class="{ 'font-medium': player.summonerName === summonerInfo.name }">
                        {{ player.summonerName }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 敌方队伍 -->
                <div>
                  <div class="flex items-center mb-1">
                    <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span class="text-sm text-gray-400">敌方队伍</span>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center" v-for="(player, i) in match.enemyMembers" :key="i">
                      <img
                          :src="getChampionImage(player.championId)"
                          alt="英雄头像"
                          class="w-5 h-5 rounded mr-2"
                      >
                      <span class="text-sm">{{ player.summonerName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div class="text-center mt-6">
          <button
              v-if="hasMoreMatches"
              @click="loadMoreMatches"
              class="bg-gray-800 hover:bg-gray-700 text-light px-6 py-3 rounded-lg transition-colors flex items-center mx-auto"
          >
            <i class="fa fa-plus mr-2"></i>加载更多比赛
          </button>
          <div v-else class="text-gray-400 py-4">
            没有更多比赛记录了
          </div>
        </div>
      </div>
    </div>

    <!-- 没有数据状态 -->
    <div v-else class="text-center py-16">
      <div class="text-6xl text-gray-700 mb-4">
        <i class="fa fa-search"></i>
      </div>
      <h3 class="text-2xl font-semibold text-gray-300 mb-2">还没有查询记录</h3>
      <p class="text-gray-400 max-w-md mx-auto">
        请在上方搜索框中输入召唤师名称，然后点击搜索按钮查看比赛记录
      </p>
    </div>

    <!-- 页脚 -->
    <footer class="mt-16 text-center text-gray-500 text-sm py-4 border-t border-gray-800/50">
      <p>召唤师战绩查询 &copy; 2025</p>
      <p class="mt-1">数据仅供参考，非官方应用</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import request from '@/utils/request.js';

// 模拟数据 - 实际应用中应该从API获取
const mockChampionData = {
  "266": {"id": "Aatrox", "name": "暗裔剑魔", "title": "战争之影"},
  "103": {"id": "Ahri", "name": "九尾妖狐", "title": "魅力之狐"},
  "84": {"id": "Akali", "name": "阿卡丽", "title": "暗影之拳"},
  "166": {"id": "Akshan", "name": "阿克尚", "title": "正义之枪"},
  "12": {"id": "Alistar", "name": "牛头酋长", "title": "大地之怒"},
  "32": {"id": "Amumu", "name": "殇之木乃伊", "title": "悲伤之神"},
  "34": {"id": "Anivia", "name": "冰晶凤凰", "title": "冰凤凰"},
  "1": {"id": "Annie", "name": "黑暗之女", "title": "符文法师"},
  "22": {"id": "Ashe", "name": "寒冰射手", "title": "弗雷尔卓德之心"}
};

const mockSummonerSpells = {
  "1": {"id": "SummonerBoost", "name": "净化"},
  "3": {"id": "SummonerExhaust", "name": "虚弱"},
  "4": {"id": "SummonerFlash", "name": "闪现"},
  "6": {"id": "SummonerHaste", "name": "幽灵疾步"},
  "7": {"id": "SummonerHeal", "name": "治疗术"},
  "11": {"id": "SummonerSmite", "name": "惩戒"},
  "12": {"id": "SummonerTeleport", "name": "传送"},
  "14": {"id": "SummonerDot", "name": "点燃"},
  "30": {"id": "SummonerPoroThrow", "name": "魄罗投掷"},
  "32": {"id": "SummonerSnowball", "name": "标记"}
};

// 数据状态
const searchInput = ref('');
const searchHistory = ref([]);
const showHistory = ref(false);
const summonerInfo = ref(null);
const summonerRankedInfo = ref([]);
const summonerMatchesList = ref({
  result: [],  // 实际比赛数据
  count: 0     // 总比赛数
});const loading = ref(false);
const errorMessage = ref('');
const matchFilter = ref('all');
const page = ref(1);
const hasMoreMatches = ref(true);

// 计算属性 - 过滤后的比赛记录
const filteredMatches = computed(() => {
  const matches = summonerMatchesList.value.result || [];

  if (matchFilter.value === 'all') {
    return matches;
  } else if (matchFilter.value === 'win') {
    return matches.filter(match => match.win);
  } else {
    return matches.filter(match => !match.win);
  }
});

// 近期表现统计
const recentStats = computed(() => {
  const matches = summonerMatchesList.value.result || [];

  if (matches.length === 0) {
    return {
      kdaRatio: 0,
      winRate: 0,
      avgKills: 0,
      avgCs: 0
    };
  }

  const wins = matches.filter(match => match.win).length;
  const totalKills = matches.reduce((acc, match) => acc + match.kills, 0);
  const totalDeaths = matches.reduce((acc, match) => acc + match.deaths, 0);
  const totalAssists = matches.reduce((acc, match) => acc + match.assists, 0);
  const totalCs = matches.reduce((acc, match) => acc + match.totalMinionsKilled, 0);

  return {
    kdaRatio: totalDeaths > 0 ? (totalKills + totalAssists) / totalDeaths : totalKills + totalAssists,
    winRate: Math.round((wins / matches.length) * 100),
    avgKills: totalKills / matches.length,
    avgCs: totalCs / matches.length
  };
});

// 生命周期钩子
onMounted(() => {
  // 从本地存储加载历史记录
  const savedHistory = localStorage.getItem('summonerSearchHistory');
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory);
  }

  // 模拟获取当前召唤师信息
  // 在实际应用中，这里应该调用真实的API
  // loadCurrentSummoner();
});

// 方法
const searchSummoner = async () => {
  const summonerName = searchInput.value.trim();
  if (!summonerName) {
    alert('请输入召唤师名称');
    return;
  }

  // 添加到历史记录
  addToHistory(summonerName);

  // 重置状态
  summonerInfo.value = null;
  summonerRankedInfo.value = [];
  summonerMatchesList.value = [];
  page.value = 1;
  hasMoreMatches.value = true;
  errorMessage.value = '';
  loading.value = true;

  try {
    // 获取比赛记录
    const matchesResponse = await request.post('/v1/api/summoner/matches/list', {
      name: summonerName,
      page: 1,
      limit: 10
    });

    // 更新为新的数据结构
    summonerMatchesList.value = {
      result: matchesResponse.data?.result || [],
      count: matchesResponse.data?.count || 0
    };

    hasMoreMatches.value = (summonerMatchesList.value.result?.length || 0) >= 10;
  } catch (error) {
    console.error('查询出错:', error);
    errorMessage.value = error.message || '查询失败，请重试';
  } finally {
    loading.value = false;
  }
};

// 修改后的加载更多方法
const loadMoreMatches = async () => {
  if (loading.value || !hasMoreMatches.value) return;

  loading.value = true;
  page.value++;

  try {
    const matchesResponse = await request.post('/v1/api/summoner/matches/list', {
      name: summonerInfo.value.name,
      page: page.value,
      limit: 10
    });

    // 合并结果
    summonerMatchesList.value = {
      result: [...summonerMatchesList.value.result, ...(matchesResponse.data?.result || [])],
      count: matchesResponse.data?.count || summonerMatchesList.value.count
    };

    hasMoreMatches.value = (matchesResponse.data?.result?.length || 0) >= 10;
  } catch (error) {
    console.error('加载更多比赛记录出错:', error);
    page.value--; // 回退页码
  } finally {
    loading.value = false;
  }
};

const addToHistory = (name) => {
  // 移除已存在的同名记录
  const index = searchHistory.value.findIndex(item => item.toLowerCase() === name.toLowerCase());
  if (index !== -1) {
    searchHistory.value.splice(index, 1);
  }

  // 添加到历史记录开头
  searchHistory.value.unshift(name);

  // 限制历史记录数量
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop();
  }

  // 保存到本地存储
  localStorage.setItem('summonerSearchHistory', JSON.stringify(searchHistory.value));
};

const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

const selectHistory = (name) => {
  searchInput.value = name;
  showHistory.value = false;
};

const removeHistory = (index) => {
  searchHistory.value.splice(index, 1);
  localStorage.setItem('summonerSearchHistory', JSON.stringify(searchHistory.value));
};

const clearAllHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('summonerSearchHistory');
  showHistory.value = false;
};

const retry = () => {
  if (searchInput.value.trim()) {
    searchSummoner();
  }
};

// 辅助方法
const getChampionName = (championId) => {
  return mockChampionData[championId]?.name || `英雄 ${championId}`;
};

const getChampionImage = (championId) => {
  return mockChampionData[championId]
      ? `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${mockChampionData[championId].id}.png`
      : 'https://picsum.photos/48/48?random=champion';
};

const getSummonerSpellImage = (spellId) => {
  return mockSummonerSpells[spellId]
      ? `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/${mockSummonerSpells[spellId].id}.png`
      : 'https://picsum.photos/24/24?random=spell';
};

const getItemImage = (itemId) => {
  return itemId
      ? `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/item/${itemId}.png`
      : 'https://picsum.photos/24/24?random=item';
};

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const formatGameDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const gameDate = new Date(timestamp);
  const diffMs = now - gameDate;

  const diffDays = Math.floor(diffMs / 86400000); // 1天 = 86400000毫秒
  const diffHours = Math.floor((diffMs % 86400000) / 3600000); // 1小时 = 3600000毫秒
  const diffMinutes = Math.floor((diffMs % 3600000) / 60000); // 1分钟 = 60000毫秒

  if (diffDays > 0) {
    return `${diffDays}天前`;
  } else if (diffHours > 0) {
    return `${diffHours}小时前`;
  } else {
    return `${diffMinutes}分钟前`;
  }
};

const getQueueTypeName = (queueType) => {
  const queueTypes = {
    "RANKED_SOLO_5x5": "单排/双排",
    "RANKED_FLEX_SR": "灵活排位",
    "RANKED_TFT": "云顶之弈"
  };
  return queueTypes[queueType] || queueType;
};

const winRate = (wins, losses) => {
  if (wins + losses === 0) return 0;
  return Math.round((wins / (wins + losses)) * 100);
};
</script>

<style scoped>
/* 这里可以添加自定义的CSS样式 */
</style>