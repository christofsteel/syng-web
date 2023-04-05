<script setup>
const emits = defineEmits(["append", "wait", "cancel"])
</script>
<template>
<div class="reveal" id="alreadyqueued" data-reveal >
<h1>You are already in queue</h1>
<p>While you can append the song anyway, you can also queue it to the "waiting room".</p>
<p>It will be appended to the queue as soon, as your next song leaves the queue.</p>
<button class="button" @click="$emit('append')">Append</button>
<button class="button" @click="$emit('wait')">Waiting Room</button>
<button class="button" @click="$emit('cancel')">Abort</button>
</div>
</template>
