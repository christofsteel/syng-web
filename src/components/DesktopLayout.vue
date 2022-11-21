<script setup>
import SearchDesktop from './SearchDesktop.vue'
import QueueDesktop from './QueueDesktop.vue'

const props = defineProps(['state']);
const emit = defineEmits(['update:searchTerm', 'search'])
</script>


<template>
  <div class="splitter">
    <SearchDesktop :search="state.search" @update:searchTerm="(val) => $emit('update:searchTerm', val)" @search="$emit('search')" />
    <QueueDesktop :queue="state.queue" />
      <div class="comp-column" id="right-side">
              <div class="header">Recent</div>
              <div id="large-recent-list">
                  <div class="vsplit">
                      <div id="large-recent-list-wrapper" class="results">
                          <ol id="large-last10" class="vertical menu">
                              <li rv-each-entry="queue.last10">
                                  <div class="row">
                                      <span class="artist">{ entry.artist }</span>
                                      <span class="title">{ entry.title }</span>
                                      <span class="album">{ entry.album }</span>
                                  </div>
                                  <div class="row">
                                      <span class="singer">{ entry.performer }</span>
                                  </div>
                              </li>
                          </ol>
                      </div>
                  </div>
              </div>
      </div>
  </div>
</template>
