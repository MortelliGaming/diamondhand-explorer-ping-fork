<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { suggestChain } from '@leapwallet/cosmos-snap-provider';
import { useDashboard, type ChainConfig, useBlockchain, NetworkType } from '@/stores';
import { CosmosRestClient } from '@/libs/client';
import { onMounted } from 'vue';
import AdBanner from '@/components/ad/AdBanner.vue';

import type {ChainInfo} from '@keplr-wallet/types'

const error = ref("")
const conf = ref("")
const dashboard = useDashboard()
const selected = ref('')
const wallet = ref("keplr")
const network = ref(NetworkType.Mainnet)
const mainnet = ref([] as ChainConfig[])
const testnet = ref([] as ChainConfig[])
const chains = computed(() => {
    return network.value === NetworkType.Mainnet? mainnet.value : testnet.value
})

const keplrConfigs: Ref<{mainnet: Record<string, ChainInfo>, testnet: Record<string, ChainInfo>}> = ref({
    mainnet: {},
    testnet: {}
})

function readKeplrConfig() {
    const mainnetConfig: Record<string, ChainInfo> = {}
    const mainnetSource: Record<string, ChainInfo> = import.meta.glob('../../../chains/mainnet/keplr/*.keplr.json', { eager: true });
    Object.values<ChainInfo>(mainnetSource).forEach((x: ChainInfo) => {
        console.log(x) 
        mainnetConfig[x.chainId] = x;
    });

    const testnetConfig: Record<string, ChainInfo> = {}
    const testnetSource: Record<string, ChainInfo> = import.meta.glob('../../../chains/testnet/keplr/*.keplr.json', { eager: true });
    Object.values<ChainInfo>(testnetSource).forEach((x: ChainInfo) => {
        console.log(x) 
        testnetConfig[x.chainId] = x;
    });

    keplrConfigs.value.mainnet = mainnetConfig
    keplrConfigs.value.testnet = testnetConfig
}
readKeplrConfig();

onMounted(() => {
    const chainStore = useBlockchain()
    // selected.value = chainStore.current || Object.values(dashboard.chains)[0]
    initParamsForKeplr()

    dashboard.loadLocalConfig(NetworkType.Mainnet).then((res) => {
        mainnet.value = Object.values<ChainConfig>(res)
    })
    dashboard.loadLocalConfig(NetworkType.Testnet).then((res) => {
        testnet.value = Object.values<ChainConfig>(res)
    })
})

function onchange() {
    wallet.value === "keplr" ? initParamsForKeplr() : initSnap()
}

async function initParamsForKeplr() {
    const chain = selected.value
    console.log(keplrConfigs.value)
    
    if(network.value === NetworkType.Mainnet) {
        if(keplrConfigs.value.mainnet[chain]) {
            conf.value = JSON.stringify(keplrConfigs.value.mainnet[chain], null, 2)
            return;
        }
    }
    if(network.value === NetworkType.Testnet) {
        if(keplrConfigs.value.testnet[chain]) {
            conf.value = JSON.stringify(keplrConfigs.value.testnet[chain], null, 2)
            return;
        }
    }
    /*
    if(!chain.endpoints?.rest?.at(0)) throw new Error("Endpoint does not set");
    const client = CosmosRestClient.newDefault(chain.endpoints.rest?.at(0)?.address || "")
    const b = await client.getBaseBlockLatest()   
    const chainid = b.block.header.chain_id

    const gasPriceStep = chain.keplrPriceStep || {
        low: 0.01,
        average: 0.025,
        high: 0.03,
    }
    const coinDecimals = chain.assets[0].denom_units.find(x => x.denom === chain.assets[0].symbol.toLowerCase())?.exponent || 6
    conf.value = JSON.stringify({
        chainId: chainid,
        chainName: chain.chainName,
        rpc: chain.endpoints?.rpc?.at(0)?.address,
        rest: chain.endpoints?.rest?.at(0)?.address,
        bip44: {
            coinType: Number(chain.coinType),
        },
        // coinType: Number(chain.coinType),
        bech32Config: {
            bech32PrefixAccAddr: chain.bech32Prefix,
            bech32PrefixAccPub: `${chain.bech32Prefix}pub`,
            bech32PrefixValAddr: `${chain.bech32Prefix}valoper`,
            bech32PrefixValPub: `${chain.bech32Prefix}valoperpub`,
            bech32PrefixConsAddr: `${chain.bech32Prefix}valcons`,
            bech32PrefixConsPub: `${chain.bech32Prefix}valconspub`,
        },
        currencies: chain.assets.map(asset => ({
            coinDenom: asset.symbol,
            coinMinimalDenom: asset.base,
            coinDecimals,
            coinGeckoId: asset.coingecko_id || 'unknown',
        })),
        feeCurrencies: chain.fee?.fee_tokens,
        stakeCurrency: chain.assets.filter(a => (a as any).isStakingAsset == true).map(asset => {
            return {
                coinDenom: asset.symbol,
                coinMinimalDenom: asset.base,
                coinDecimals,
                coinGeckoId: asset.coingecko_id || 'unknown',
                gasPriceStep,
            };
        }),
        features: chain.keplrFeatures || [],
    }, null, '\t')
    */
}

async function initSnap() {
    return
    /* 

    const chain = selected.value
    const [token] = chain.assets

    if(!chain.endpoints?.rest?.at(0)) throw new Error("Endpoint does not set");
    const client = CosmosRestClient.newDefault(chain.endpoints.rest?.at(0)?.address || "")
    const b = await client.getBaseBlockLatest()   
    const chainId = b.block.header.chain_id

    conf.value = JSON.stringify({
        chainId,
        chainName: chain.chainName,
        bech32Config: {
            bech32PrefixAccAddr: chain.bech32Prefix,
        },
        bip44: {
            coinType: Number(chain.coinType),
        },
        feeCurrencies: [
            {
            coinDenom: token.display,
            coinMinimalDenom: token.base,
            coinDecimals: token.denom_units.find(x => x.denom === token.display)?.exponent || 6,
            coinGeckoId: token.coingecko_id,
            gasPriceStep: {
                low: 0.0625,
                average: 0.5,
                high: 62.5,
            },
            },
        ],
    }, null, '\t')
    */
}

function suggest() {
    console.log(wallet.value)
    if(wallet.value == "keplr") {
    console.log(wallet.value)
        // @ts-ignore
        if (window.keplr != undefined) {
    console.log(wallet.value)
            // @ts-ignore
            window.keplr.experimentalSuggestChain(JSON.parse(conf.value)).catch(e => {
                error.value = e
                console.log(e)
            })
        }
    } else {
        suggestChain(JSON.parse(conf.value), {});
    }
}

</script>

<template>
    <div class="bg-base-100 p-4 rounded text-center">
        <div class="flex text-center">
            <select v-model="network" class="select select-bordered">
                <option :value="NetworkType.Mainnet">Mainnet</option>
                <option :value="NetworkType.Testnet">Testnet</option>
            </select>
            <select v-model="selected" class="select select-bordered mx-5" @change="onchange">
                <option v-for="c in Object.keys(keplrConfigs[(network === NetworkType.Mainnet ? 'mainnet' : 'testnet')])" :value="c">
                    {{ c }}
                </option>
            </select>
            <label><input type="radio" v-model="wallet" value="keplr" class="radio radio-bordered" @change="onchange" /> Keplr</label>
            <label><input type="radio" v-model="wallet" value="metamask" class="radio radio-bordered ml-4" @change="onchange"/> Metamask</label>
        </div>
        <div class="text-main mt-5">
            <textarea v-model="conf" class="textarea textarea-bordered w-full" rows="15"></textarea>
        </div>
        <div class="mt-4 mb-4">

            <button class="btn !bg-primary !border-primary text-white mr-2" @click="suggest">Suggest {{ selected }} TO {{ wallet }}</button>

            <div class="mt-4">
                If the chain is not offically support on Keplr/Metamask Snap, you can submit these parameters to enable Keplr/Metamask Snap.
            </div>
        </div>

        <AdBanner id="suggest-banner-ad" unit="banner" width="970px" height="90px" />
    </div>
</template>
