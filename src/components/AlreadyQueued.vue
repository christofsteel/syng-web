<script setup>
const emits = defineEmits(["append", "wait", "cancel"]);
const props = defineProps(["double_entry"]);
</script>
<template>
<div class="reveal" id="alreadyqueued" data-reveal >
<h1>You are already in queue</h1>
<p>You can
<ul>
<li>append the song anyway, or</li>
<li>add it to the <i>waiting room</i>.</li>
</ul>
</p>
<p>Your song in the waiting room will be added to the queue, once 
<b>{{double_entry.artist}} - {{double_entry.title}}</b> <i>({{double_entry.performer}})</i>
leaves the queue.</p>
<div class="grid-x">
  <div class="cell medium-6 small-12 btn">
    <button class="button expanded" @click="$emit('wait', double_entry.reason == 'uid' ? double_entry.uid : null)">Waiting room</button>
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
