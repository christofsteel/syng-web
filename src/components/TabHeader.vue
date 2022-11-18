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
