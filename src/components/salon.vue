<template>
  <div class="bg-grey-darken-1 h-100 rounded-0 pa-5">
    <h1>{{ chanel.nom }}</h1>
    <ul>
      <!-- <li v-for="msg1 in msgtab" :key="msg1.id">{{ msg1.content }}</li> -->
      <v-list lines="three">
        <v-list-item
          v-for="msg1 in msgtab"
          :key="msg1.id"
          :title="msg1.content"
          subtitle="..."
        ></v-list-item>
      </v-list>
      <!-- <li v-for="msg in content" :key="msg">{{ msg }}</li> -->
      <v-list lines="three">
        <v-list-item
          v-for="msg in content"
          :key="msg"
          :title="msg"
          subtitle="..."
        ></v-list-item>
      </v-list>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msgtab: messages,
    };
  },
  props: ["content", "chanel", "messages"],
};
</script>
