<script setup>
const props = defineProps(['searchTerm']);
const emit = defineEmits(['update:searchTerm', 'search'])
</script>

<template>
    <div class="input-group">
        <input id="search-query" class="input-group-field" type="search" placeholder="Search term or YouTube link (https://www.youtube.com/watch?v=...)" :value='searchTerm' @input="$emit('update:searchTerm', $event.target.value)" @keyup.enter="$emit('search')" />
        <div class="input-group-button">
            <button class="button" @click="$emit('search')"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></button>
        </div>
    </div>
</template>

<style scoped>
.input-group {
    margin-bottom: 0;
}
</style>
