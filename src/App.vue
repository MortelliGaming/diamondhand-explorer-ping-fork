<script setup lang="ts">
import { themeChange } from 'theme-change';
import { onMounted } from 'vue';
import TxDialog from './components/TxDialog.vue';

// @ts-ignore-next-line
import { useWalletStore } from 'dh-widget'
import { storeToRefs } from 'pinia';

onMounted(() => {
  themeChange(false);
});
</script>

<template>
  <v-app>
    <v-main>
      <RouterView />
      <TxDialog />
    </v-main>
  </v-app>
</template>
