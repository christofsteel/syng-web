<script>
export default {
 props: ['active', 'icon', 'link', 'variant']
}
</script>
<template>
<div class="tabs-title" :class="{ 'is-active': active }"><a :href="link">
<font-awesome-icon :icon="[variant, icon]" />
</a></div>
</template>

<style scoped>
.tabs-title > a{
    color: #008000;
}

.tabs-title > a:hover {
    background-color: #444444;
    color: #FFFFFF;
}

.tabs-title > a:focus, .tabs-title > a[aria-selected="true"]{
    color: #FFFFFF;
    font-weight: bold;
    background-color: #008000;
}
.tabs-title {
    flex-grow: 1;
    text-align: center;
}
</style>
