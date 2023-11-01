<script setup>
  import {ref} from 'vue'

const props = defineProps(["config"])
const emits = defineEmits(["update_config", "close"])

const new_cfg = ref({"config": ""})

function update_new_cfg(evt) {
  new_cfg.value.config = evt.target.value
}

function send_cfg() {
console.log(new_cfg.value.config)
  emits('update_config', new_cfg.value.config)
}
</script>

<template>
  <div class="reveal" id="config" data-reveal >
    <h1>Config</h1>
    <textarea @input="update_new_cfg">{{config}}</textarea>
    <div class="grid-x">
      <div class="cell medium-6 small-12 btn">
        <button
          class="button expanded"
          @click="send_cfg"
          >
          Ok
        </button>
      </div>
      <div class="cell medium-6 small-12 btn">
        <button class="button expanded alert" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>
