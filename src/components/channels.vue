<template>
  <v-container class="ma-0 pa-0">
    <v-menu transition="scroll-y-transition" v-if="servname">
      <template v-slot:activator="{ props }">
        <v-btn
          class="w-100 rounded-0 bg-grey-darken-3"
          height="48"
          v-bind="props"
          append-icon="mdi:mdi-chevron-down"
        >
          {{ servname }}
        </v-btn>
      </template>
      <v-list class="bg-grey-darken-3">
        <v-list-item link @click="$emit('leave-serv')">
          <v-list-item-title v-text="'Quitter Le serveur'"></v-list-item-title>
        </v-list-item>
        <v-list-item link @click="$emit('add-chanel')" v-if="isOwner">
          <v-list-item-title v-text="'Ajouter une Chaine'"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-list>
      <v-list-item
        v-for="chanel in from"
        :key="chanel.id"
        :title="chanel.nom"
        link
        @click="$emit('selected-chanel', chanel)"
      >
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      profs: [],
    };
  },
  computed: {
    isOwner() {
      if (this.owner == this.$store.state.userid) {
        return true;
      } else {
        return false;
      }
    },
  },
  props: ["from", "servname", "owner"],
  emits: ["selected-chanel", "leave-serv", "add-chanel"],
};
</script>
