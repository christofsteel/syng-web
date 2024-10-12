<script setup>
import SearchTab from './SearchTab.vue'
import QueueTab from './QueueTab.vue'
import RecentTab from './RecentTab.vue'
import TabHeader from './TabHeader.vue'

const props = defineProps(['state']);
const emit = defineEmits(['update:searchTerm', 'search', 'append', 'skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'notify_enable', 'notify_disable'])

</script>

<template>
<div class="splitter">
    <div class="comp-column">
        <div data-tabs class="tabs" id="main-tab">
            <TabHeader active="true" link="#simplesearch" icon="fa-magnifying-glass" />
            <TabHeader link="#queue-list" id="queue-tab-title" icon="fa-list" />
            <TabHeader link="#recent-list" icon="fa-history" />
        </div>
        <div class="tabs-container" data-tabs-content="main-tab">
          <SearchTab :socket="state.socket" :search="state.search" :searching="state.searching" @update:searchTerm="(val) => $emit('update:searchTerm', val)" @search="$emit('search')" @append="(entry) => $emit('append', entry)"/>
          <QueueTab
            :socket="state.socket"
            :queue="state.queue"
            :admin="state.admin"
            :waiting_room="state.waiting_room"
            :waiting_room_enabled="state.waiting_room_enabled"
            :notify_me="state.notify_me"
            @notify_disable="(uuid) => $emit('notify_disable', uuid)"
            @notify_enable="(uuid) => $emit('notify_enable', uuid)"
            @skip="(uuid) => $emit('skip', uuid)"
            @moveUp="(uuid) => $emit('moveUp', uuid)"
            @skipCurrent="$emit('skipCurrent')"
            @waitingRoomToQueue="(uuid) => $emit('waitingRoomToQueue', uuid)"
            /> 
          <RecentTab :recent="state.recent" :admin="state.admin" />
        </div>
    </div>
</div>
</template>

<style scoped>
.splitter {
    display: flex;
    height: 100vh;
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

