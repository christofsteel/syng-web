<script setup>
const props = defineProps(['result']);
</script>
<template>
<li>
<div class="grid-x">
  <div class="cell small-9">
    <span class="artist">{{result.artist}}</span>
    <span class="title">{{result.title}}</span><br />
    <span class="album">{{resultalbum}}</span>
  </div>
  <div class="cell small-3">
    <button class="button alert fright">
<font-awesome-icon icon="fa-brands fa-youtube" />
    </button>
    <button class="button fright">
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
