<script setup>
const props = defineProps(["current_name","current_entry"])
const emits = defineEmits(["update:currentName", "append", "close_name"])
</script>

<template>
  <div class="reveal" id="getusername" @keyup.enter="$emit('append')" data-reveal >
    <h1>Please enter your name</h1>
    <label>Name
      <input
        type="text"
        @input="(evt) => $emit('update:currentName', evt.target.value)"
        placeholder="Arno Nym"
        :value="current_name"
        >
    </label>
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
        <button class="button expanded alert" @click="$emit('close_name')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  padding: 3px;
}
</style>
