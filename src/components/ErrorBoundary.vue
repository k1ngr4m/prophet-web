<template>
    <slot v-if="!hasError" />
    <div v-else>加载失败，请重试</div>
</template>
<script setup>
import { ref, onErrorCaptured } from 'vue';
const hasError = ref(false);
onErrorCaptured(() => { hasError.value = true; });
</script>
