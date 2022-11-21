<script setup>
import Entry from './Entry.vue'
</script>

<script>
export default {
  props: ['admin', 'queue']
  }
</script>

<template>
  <div class="vsplit">
      <div id="queue-list-wrapper" class="results">
          <ul id="queue" class="vertical menu">          
          <Entry v-for="(entry, index) in queue" :artist="entry.artist" :title="entry.title" :album="entry.album" :performer="entry.performer" :current="index == 0" :admin="admin" />
          <li v-if="admin">
              <div class="row">
                  <div class="columns small-12">
                          <a class="button" download="queue.json" rv-href="queue.data">Save</a>
                          <label for="small-bulk-upload" class="button bulk-upload-label">Bulk Append</label>
                          <input type="file" id="small-bulk-upload" rv-on-change="queue.bulk_append" class="show-for-sr">
                  </div>
              </div>
          </li>
          </ul>
      </div>
  </div>
</template>
