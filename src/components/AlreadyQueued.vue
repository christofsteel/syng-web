<script setup>
const emits = defineEmits(["append", "wait", "cancel"]);
const props = defineProps(["double_entry"]);
</script>
<template>
<div class="reveal" id="alreadyqueued" data-reveal >
<h1>You are already in queue</h1>
<p>
<b>{{double_entry.artist}} - {{double_entry.title}}</b> <i>({{double_entry.performer}})</i>
</p>
<p>To give everyone a chance to sing, you are limited to one song in the active queue, but you can add yourself to the <b>waiting room</b>.
Songs in the waiting room will be added to the queue, once your old song leaves the queue.</p>
<p>If you think this is an error, you can
<ul>
<li>choose another name, or</li>
<li>add it to the waiting room and talk to the organizers for manual insertion into the queue.</li>
</ul>
</p>
<div class="grid-x">
  <div class="cell medium-6 small-12 btn">
    <button class="button expanded" @click="$emit('wait', double_entry.reason == 'uid' ? double_entry.uid : null)">Add to waiting room</button>
  </div>
  <div class="cell medium-6 small-12 btn">
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
