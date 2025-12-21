<script setup>
const props = defineProps(["current_name","current_entry"])
const emits = defineEmits(["update:currentName", "append", "cancel"])
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
            >
          </label>
        </div>
      </div>
      <div class="gird-x grid-padding-x">
        <div class="medium-6 cell">
          <label>Collaboration Mode:
            <select v-model="current_entry.collab_mode">
              <option value="" selected>None</option>
              <option value="solo">Only me/us</option>
              <option value="group">Everyone can join</option>
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
