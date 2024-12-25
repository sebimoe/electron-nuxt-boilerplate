<script setup lang="ts">
const electron = useElectron() ?? null;

const preloadResult = ref<string>();
const invocationResult = ref<string>();

async function invokeInMain() {
  invocationResult.value = await electron?.invokeSomethingInMain(Math.random());
}

</script>
<template>
  <div v-if="!electron">
    Not rendering in electron.
  </div>
  <div v-else>
    <div>
      <button @click="preloadResult = electron.doSomethingInPreload(Math.random())">doSomethingInPreload</button>
      <div>
        Result:
        <pre>{{ JSON.stringify(preloadResult) }}</pre>
      </div>
    </div>
    <div>
      <button @click="electron.doSomethingInMain(Math.random())">doSomethingInMain</button>
    </div>
    <div>
      <button @click="invokeInMain()">invokeSomethingInMain</button>
      <div>
        Result:
        <pre>{{ JSON.stringify(invocationResult) }}</pre>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>

</style>