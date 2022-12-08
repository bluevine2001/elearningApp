<template>
  <v-card class="w-50 mx-auto">
    <v-card-title>Ajouter Une Chaine</v-card-title>
    <v-card-text>
      <v-text-field
        label="Nom de la chaine"
        v-model="chanelName"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn class="text-purple-lighten-2" @click="$emit('close-add-chanel')"
        >Annuler</v-btn
      >
      <v-btn class="text-purple-lighten-2" @click="createChanel"
        >Créer la chaine</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      chanelName: "",
    };
  },
  props: ["servid"],
  methods: {
    async createChanel() {
      const req = await axios.post(
        "http://localhost:3000/chanels",
        {
          servid: this.servid,
          name: this.chanelName,
          userid: this.$store.state.userid,
          type: "text",
        },
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      if (req.status == 200) {
        this.$emit("saved-close-add-chanel");
      }
    },
  },
};
</script>
