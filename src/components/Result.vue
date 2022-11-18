<script>
export default {
 props: ['artist', 'title', 'album']
}
</script>
<template>
<div class="row">
  <div class="columns small-10">
    <span class="artist">{{artist}}</span>
    <span class="title">{{title}}</span>
    <span class="album">{{album}}</span>
  </div>
  <div class="columns small-2">
    <button class="button alert fright">
      <i class="fa fa-play"></i>
    </button>
    <button class="button fright">
      <i class="fa fa-plus"></i>
    </button>
  </div>
</div>

</template>
<style scope>
.artist::after{
    content: " - ";
}

.album::before {
    content: " [";
}
.album::after {
    content: "]";
}

</style>
