<script setup>
import Entry from './Entry.vue'
</script>

<template>
  <div class="tabs-panel" id="recent-list">
      <div class="vsplit">
          <div id="recent-list-wrapper" class="results">
              <ol id="last10" class="vertical menu">
              <Entry artist="Artist" title="Title" album="Album" performer="Performer" />
              <Entry artist="Artist" title="Title" album="Album" performer="Performer" />
              <Entry artist="Artist" title="Title" album="Album" performer="Performer" />
              </ol>
          </div>
      </div>
  </div>
</template>
