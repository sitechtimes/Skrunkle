<template>
  <div>
    <h1>Sign In Page</h1>
  </div>
</template>
<script setup>
onMounted(async () => {
  console.log(await $fetch("/api/users"));
});
</script>

<style lang="scss" scoped></style>
