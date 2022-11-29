<script setup>
import Entry from './Entry.vue'

const props = defineProps(['recent'])
</script>
<template>
  <div class="vsplit">
      <div id="recent-list-wrapper" class="results">
          <ul id="recent" class="vertical menu">
            <Entry v-for="entry in recent" :entry="entry" :firstStartedAt="0" :currentTime="0" :offset="0" />
          </ul>
      </div>
  </div>
</template>
<style scoped>
#recent {
    flex-direction: column-reverse;
}
</style>
