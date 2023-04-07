<script setup>
const emits = defineEmits(["append", "wait", "cancel"])
</script>
<template>
<div class="reveal" id="alreadyqueued" data-reveal >
<h1>You are already in queue</h1>
<p>While you can append the song anyway, you can also add it to the <i>waiting room</i>.</p>
<p>It will be appended to the queue as soon, as your next song leaves the queue.</p>
<div class="grid-x">
  <div class="cell medium-6 small-12 btn">
    <button class="button expanded" @click="$emit('wait')">Waiting room</button>
  </div>
  <div class="cell medium-6 small-12 btn">
    <button class="button expanded" @click="$emit('append')">Append anyway</button>
  </div>
  <div class="cell medium-12 small-12 btn">
    <button class="button expanded alert" @click="$emit('cancel')">Cancel</button>
  </div>
</div>
</div>
</template>
<style scoped>
.btn {
  padding: 3px;
}
</style>
