<template>
  <v-card>
    <v-card-title>Ajouter une chaine</v-card-title>
    <v-card-text>
      <v-text-field
        label="Nom de la chaine"
        v-model="chanelName"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn class="float-left ma-2 ml-7" @click="$emit('close-chanel')"
        >Annuler</v-btn
      >
      <v-btn class="float-right ma-2 mr-7" @click="saveInfos"
        >Enregistrer</v-btn
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
      serverid: this.server,
    };
  },
  props: ["server"],
  methods: {
    async saveInfos() {
      console.log(this.serverid);
      const reqservs = await axios.post(
        "http://localhost:3000/chanels/",
        {
          name: this.chanelName,
          type: "text",
          servid: this.serverid,
        },
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      console.log(reqservs);
      if (reqservs.status == 200) {
        this.$emit("close-chanel");
      }
    },
  },
};
</script>
