import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
    state: () => ({ isLoggedIn: false, name: '' }),
    actions: {
        login(name) { this.isLoggedIn = true; this.name = name; },
    },
});
