<script setup>
import SearchTab from './SearchTab.vue'
import QueueTab from './QueueTab.vue'
import RecentTab from './RecentTab.vue'
import TabHeader from './TabHeader.vue'

const props = defineProps(['state']);
const emit = defineEmits(['update:searchTerm'])

</script>

<template>
<div class="splitter">
    <div class="comp-column">
        <div data-tabs class="tabs" id="main-tab">
            <TabHeader active="true" link="#simplesearch" icon="fa-magnifying-glass" />
            <TabHeader link="#queue-list" icon="fa-list" />
            <TabHeader link="#recent-list" icon="fa-history" />
        </div>
        <div class="tabs-container" data-tabs-content="main-tab">
          <SearchTab :search="state.search" @update:searchTerm="(val) => $emit('update:searchTerm', val)"/>
          <QueueTab :queue="state.queue" />
          <RecentTab />
        </div>
    </div>
</div>
</template>

<style scoped>
.splitter {
    display: flex;
    height: 100vh;
}
.comp-column {
    max-height: 100vh;
    flex:1;
    display: flex;
    flex-direction: column;
}
.tabs-container {
    flex: 1;
    position: relative;
    overflow: auto;
}
</style>

<style>
.tabs-panel {
    height: 100%;
}
</style>

