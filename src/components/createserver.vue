<template>
  <v-card width="440" class="mx-auto">
    <v-card-title class="mx-auto">
      <span class="text-h4 font-weight-bold">Ajouter un serveur</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-btn
              append-icon="mdi-chevron-right"
              width="100%"
              @click="createserver"
            >
              Créer un serveur
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              append-icon="mdi-chevron-right"
              width="100%"
              @click="joinserver"
            >
              Rejoindre un serveur
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="createServ">
        <v-text-field placeholder="Nom du serveur"></v-text-field>
      </v-container>
      <v-container v-if="joinServ">
        <v-text-field placeholder="Identifiant du serveur"></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red-darken-1" variant="text" @click="$emit('close-modal')">
        Annuler
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      firststepmodal: true,
      createServ: false,
      joinServ: false,
    };
  },
  computed: {
    joinserver() {
      this.firststepmodal = false;
      this.createServ = false;
      this.joinServ = true;
    },
    createserver() {
      this.firststepmodal = false;
      this.createServ = true;
      this.joinServ = false;
    },
    retour() {
      this.firststepmodal = true;
      this.createServ = false;
      this.joinServ = false;
    },
  },
};
</script>
