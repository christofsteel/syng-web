<script setup>
const props = defineProps(['result']);
const emits = defineEmits(['append'])
</script>
<template>
<li>
<div class="grid-x">
  <div class="cell small-9">
    <span class="artist">{{result.artist}}</span>
    <span class="title">{{result.title}}</span><br />
    <span class="album">{{result.album}}</span>
  </div>
  <div class="cell small-3">
    <a class="button alert fright" target="_blank" rel="noreferrer noopener" :href="result.id" v-if="result.source == 'youtube'">
<font-awesome-icon icon="fa-brands fa-youtube" />
    </a>
    <button class="button fright" @click="$emit('append')">
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
  </div>
</div>
</li>
</template>
<style scoped>
.artist::after{
    content: " - ";
}

.singer {
    font-size: smaller;
    font-style: italic;
}

.title {
    font-weight: bold;
}

</style>
