<script setup>
const props = defineProps(['result']);
const emits = defineEmits(['append', 'configure_and_append']);
</script>
<template>
<li>
<div class="grid-x">
  <div class="cell small-9">
    <span class="artist">{{result.artist}}</span>
    <span class="title">{{result.title}}</span><br />
    <span class="album">
          <a class="yt-link" target="_blank" rel="noreferrer noopener" :href="result.ident" v-if="result.source == 'youtube'">
            <font-awesome-icon icon="fa-brands fa-youtube" />
            {{result.album}}</a>
          <span v-else>
            {{result.album}}
          </span>
        </span>
  </div>
  <div class="cell small-3">
<!--     <a class="button alert fright" target="_blank" rel="noreferrer noopener" :href="result.ident" v-if="result.source == 'youtube'"> -->
<!-- <font-awesome-icon icon="fa-brands fa-youtube" /> -->
<!--     </a> -->
    <!-- <button class="button fright" @click="$emit('append')"> -->
    <!--   <font-awesome-icon icon="fa-solid fa-chair" /> -->
    <!-- </button> -->
    <button class="button fright" @click="$emit('append')" title="Add to queue">
      <font-awesome-icon icon="fa-solid fa-share" />
    </button>
    <button class="button fright" @click="$emit('configure_and_append')" title="Configure and add to queue">
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

.button {
    margin-left: 0.1em;
}

.yt-link {
  color: rgb(200, 0, 0);
  display: inline;
  padding: 0;

}
</style>
