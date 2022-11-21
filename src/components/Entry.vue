<script>
export default {
  props: ['admin', 'artist', 'title', 'album', 'performer', 'current']
}
</script>

<template>
  <li :class="{ current: current }">
      <div class="grid-x">
          <div class="cell" :class="{'small-9': admin}">
            <span class="artist">{{ artist }}</span>
            <span class="title">{{ title }}</span><br />
            <span class="performer">{{ performer }}</span>
          </div>
          <div v-if="admin" class="cell small-3">
                  <button class="button alert fright" v-if="!current">
                  <font-awesome-icon icon="fa-solid fa-step-forward" />
                  </button>
                  <button class="button alert fright">
                  <font-awesome-icon icon="fa-solid fa-times" />
                  </button>
          </div>
      </div>

  </li>
</template>
