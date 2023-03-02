<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { Account, Connection } from '@near-js/accounts'

const account = new Account(Connection.fromConfig({
    networkId: 'testnet',
    provider: { type: 'JsonRpcProvider', args: { url: 'https://rpc.testnet.near.org' } },
    signer: { type: 'InMemorySigner', keyStore: {} },
}), 'gornt.testnet');

defineProps<{ msg: string }>()

const count = ref(0)
let balance = ref('0')

account.getAccountBalance().then(({ total }) => { balance.value = total; })

</script>

<template>
  <h1>{{ msg }}</h1>

    <h2>{{ dayjs().format() }}</h2>
    <div>{{ balance }}</div>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
