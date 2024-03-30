<script lang="ts" setup>
import Countdown from '@chenfengyuan/vue-countdown';
import { watch } from 'vue';
import { ref, onMounted, type Ref, onUnmounted } from 'vue';
import { getTimeComponents } from '../libs/utils';

const props = defineProps({
  time: { type: Number },
  css: { type: String },
});

const s = ref(0)

const timeLeft = ref(0)
const interval: Ref<NodeJS.Timeout|null> = ref(null);

watch( props, (oldv, newv) => {
  if(timeLeft.value != newv.time) {
    timeLeft.value = newv.time ?? 0
  }
}) 

onMounted(() => {
  interval.value = setInterval(() => {
    timeLeft.value = props.time ?? 0 > 0 ? timeLeft.value - 1000 : timeLeft.value + 1000
  }, 1000)
});

onUnmounted(() => {
  interval.value = null;
})

</script>
<template>
  <span class="text-primary font-bold " :class="css">{{ getTimeComponents(Math.abs(timeLeft)).days }}</span> days 
  <span class="text-primary font-bold" :class="css">{{ getTimeComponents(Math.abs(timeLeft)).hours.toString().padStart(2, '0') }}</span> hours 
  <span class="text-primary font-bold" :class="css">{{ getTimeComponents(Math.abs(timeLeft)).minutes.toString().padStart(2, '0') }}</span> minutes
  <span class="text-primary font-bold w-40" :class="css">
    <span class="countdown text-primary font-bold">{{ getTimeComponents(Math.abs(timeLeft)).seconds.toString().padStart(2, '0') }}</span> 
  </span>
  <span class="ml-1">seconds</span>
  <span v-if="timeLeft < 0">
    <b>{{ ' ' + $t('ago') }}</b>
  </span>
</template>

<style>
.countdown-container {
  display: inline-flexbox;
  position: relative;
}

.countdown {
  position: relative;
  left: 0;
  max-width: 20px;
  width: 20px;
  height: 20px;
  text-align: right;
}

</style>
