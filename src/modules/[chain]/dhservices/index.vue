<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import type { Connection } from '@/types';
import { computed } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps(['chain']);
const chainStore = useBlockchain();
const baseStore = useBaseStore()
const endpoint = ref(chainStore.current?.endpoints?.rest?.at(0)?.address)

const chainId = computed(() => baseStore.latest?.block?.header?.chain_id || "")
const chainName = computed(() => chainStore?.current?.prettyName || "")
const hdPath = computed(() => {
    return `m/44'/${ chainStore.current?.coinType }/0'/0/0`
})
</script>
<template>
  <div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title">{{ $t('dhservices.title') }}</h2>
      <h3>{{ $t('dhservices.subtitle') }} <a href="mailto:info@diamondhand.capital">info@diamondhand.capital</a></h3>
      <div v-if="chainStore?.current?.dhservices?.api">
        <span class="text-base">{{ $t('dhservices.api') }}</span>
        <div class="mockup-code bg-base-200 my-2">
            <pre data-prefix="1"><code class="text-gray-800 dark:invert">{{ chainStore?.current?.dhservices?.api }}</code></pre>
        </div>
      </div>
      <div v-if="chainStore?.current?.dhservices?.rpc">
        <span class="text-base">{{ $t('dhservices.rpc') }}</span>
        <div class="mockup-code bg-base-200 my-2">
            <pre data-prefix="1"><code class="text-gray-800 dark:invert">{{ chainStore?.current?.dhservices?.rpc }}</code></pre>
        </div>
      </div>
    </div>
    <div class="bg-base-100 my-5 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title">{{ $t('dhservices.statesync') }}</h2>
      <div class="mt-4">
        <span class="text-base">{{ $t('dhservices.notAvailableYet') }}</span>
        <!-- <div class="mockup-code bg-base-200 my-2">
            <pre data-prefix=">"><code class="text-green-400">&lt;!-- This widget is optional. --&gt; </code></pre>
            <pre data-prefix=">"><code  class="text-gray-800 dark:invert">&lt;ping-connect-wallet chain-id="{{ chainId }}" hd-path="{{ hdPath }}"/&gt;</code></pre>
        </div>-->
      </div>
    </div>
    <div class="bg-base-100 my-5 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title">{{ $t('dhservices.nodeinstallation') }}</h2>
      <div class="mt-4">
        <span class="text-base">{{ $t('dhservices.notAvailableYet') }}</span>
      </div>
    </div>
    <div class="bg-base-100 my-5 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title">{{ $t('dhservices.architecture') }}</h2>
      <div class="mt-4">
        <span class="text-base">{{ $t('dhservices.sentryvaldiatordescription') }}</span>
        <table style="width: 100%; text-align: left;">
          <thead>
            <tr>
              <th>Nodetype</th>
              <th>API</th>
              <th>RPC</th>
              <th>P2P</th>
              <th>Unconditional PeerIds</th>
              <th>Private PeerIds</th>
              <th>PEX enabled</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Public RPC</td>
              <td>Private Network Only/Public Redirect</td>
              <td>Private Network Only/Public Redirect</td>
              <td>Public Network</td>
              <td>Id of Validotor, Other Sentries, Other Trusted Nodes</td>
              <td>Id of Validator</td>
              <td>true</td>
            </tr>
            <tr>
              <td>Sentry</td>
              <td>Private Network Only</td>
              <td>Private Network Only</td>
              <td>Public Network</td>
              <td>Id of Validotor, Other Sentries, Other Trusted Nodes</td>
              <td>Id of Validator</td>
              <td>true</td>
            </tr>
            <tr>
              <td>Validator</td>
              <td>Private Network Only</td>
              <td>Private Network Only</td>
              <td>Private Network Only</td>
              <td>Ids of Sentries, Ids of Public RPC in the same priv Network having the Validators Id as private Id configured</td>
              <td>Ids of Sentries</td>
              <td>false</td>
            </tr>
          </tbody>
        </table>
        <span class="text-base">{{ $t('dhservices.pexdisabledhint') }}</span>
        <span class="text-base">{{ $t('dhservices.examplesSoon') }}</span>
      </div>
    </div>
    <div class="bg-base-100 my-5 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title">{{ $t('dhservices.nginx') }}</h2>
      <div class="mt-4">
        <span class="text-base">{{ $t('dhservices.usenginx') }}</span>
        <span class="text-base">{{ $t('dhservices.examplesSoon') }}</span>
      </div>
    </div>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'dhservices',
        order: 300
      }
    }
</route>
