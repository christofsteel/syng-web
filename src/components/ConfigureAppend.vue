<script setup>
const props = defineProps(["current_entry", "allow_collab_mode"])
const emits = defineEmits(["append", "cancel"])
</script>

<template>
  <div class="reveal" id="configureAppend" @keyup.enter="$emit('append', false)" data-reveal >
    <h1>Adding Song</h1>
    <div class="grix-container" v-if="current_entry">
      <div class="gird-x grid-padding-x">
        <div class="medium-6 cell">
          Song:
        </div>
        <div class="medium-6 cell" >
          {{ current_entry.title }} - {{ current_entry.artist }} - {{ current_entry.album }}
        </div>
      </div>
      <div class="gird-x grid-padding-x">
        <div class="medium-6 cell">
          <label>
            Name:
            <input
              type="text"
              v-model="current_entry.performer"
              placeholder="Arno Nym"
            >
          </label>
        </div>
      </div>
      <div class="gird-x grid-padding-x" v-if="allow_collab_mode">
        <div class="medium-6 cell">
          <label>Collaboration Mode:
            <select v-model="current_entry.collab_mode">
              <option value="" selected>None</option>
              <option value="solo">Only me/us</option>
              <option value="duet">Looking for Singer (ask me)</option>
              <option value="group">Everyone can join (just come on stage)</option>
            </select>
          </label>
        </div>
      </div>
    </div>
    <div class="grid-x">
      <div class="cell medium-6 small-12 btn">
        <button
          class="button expanded"
          @click="$emit('append')"
        >
          Ok
        </button>
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
