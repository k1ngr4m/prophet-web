<template>
    <NavBar />
    <router-view />
    <Footer />
    <Home />
</template>

<script setup>
import Home from './views/Home.vue';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
</script>
