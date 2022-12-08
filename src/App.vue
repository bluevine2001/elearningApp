<template>
  <v-app>
    <v-main class="bg-grey-darken-1">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  created() {
    this.$store.dispatch("tryLogin");
  },
};
</script>
