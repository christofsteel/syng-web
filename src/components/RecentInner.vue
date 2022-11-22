<script setup>
import Entry from './Entry.vue'

const props = defineProps(['recent'])
</script>
<template>
  <div class="vsplit">
      <div id="recent-list-wrapper" class="results">
          <ul id="last10" class="vertical menu">
            <Entry v-for="entry in recent" :entry="entry" />
          </ul>
      </div>
  </div>
</template>
