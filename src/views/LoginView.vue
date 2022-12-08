<template>
  <v-app-bar :elevation="2" title="New Era Learning" color="grey-darken-2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon><v-icon>mdi:mdi-school</v-icon></v-app-bar-nav-icon>
    </template>
    <template v-slot:append>
      <v-btn v-if="isLoggedIn" class="bg-white">Aller à l'app</v-btn>
    </template>
  </v-app-bar>
  <v-card class="mx-auto mt-5" max-width="344">
    <v-alert
      closable
      icon="mdi-check-circle"
      :title="messageTittle"
      :text="message"
      color="green-lighten-3"
      v-if="message != ''"
    ></v-alert>
    <v-card-title>
      <h3>Créer un compte</h3>
      <v-btn
        variant="text"
        color="blue"
        class="text-caption mx-auto"
        v-if="mode === 'register'"
        @click="mode = 'login'"
      >
        Se connecter ?
      </v-btn>
      <v-btn
        variant="text"
        color="blue"
        class="text-caption"
        v-if="mode === 'login'"
        @click="mode = 'register'"
      >
        S'inscrire
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-text-field
        label="Nom"
        type="text"
        v-model="nom"
        v-if="mode === 'register'"
      ></v-text-field>
      <v-text-field
        label="Prénom"
        type="text"
        v-model="prenom"
        v-if="mode === 'register'"
      ></v-text-field>
      <v-text-field
        label="Pseudo"
        type="text"
        v-model="pseudo"
        v-if="mode === 'register'"
      ></v-text-field>
      <v-text-field label="Email" type="email" v-model="email"></v-text-field>
      <v-text-field
        label="Mot de passe"
        type="password"
        v-model="password"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" color="deep-purple-accent-4" @click="subform">
        {{ btnCaption }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";

import axios from "axios";

export default defineComponent({
  name: "LoginView",
  data() {
    return {
      nom: "",
      prenom: "",
      email: "",
      pseudo: "",
      password: "",
      mode: "register",
      message: "",
      messageTittle: "",
    };
  },
  computed: {
    btnCaption() {
      if (this.mode == "register") {
        return "S'inscrire";
      } else {
        return "Se connecter";
      }
    },
    isLoggedIn() {
      if (this.$store.state.isLoggedin == true) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    async subform() {
      if (this.mode === "register") {
        axios
          .post("http://localhost:3000/register", {
            nom: this.nom,
            prenom: this.prenom,
            email: this.email,
            pseudo: this.pseudo,
            mdp: this.password,
          })
          .then((response) => {
            if (response.status === 200) {
              this.email = "";
              this.password = "";
              this.nom = "";
              this.prenom = "";
              this.pseudo = "";
              this.messageTittle = "Inscription effectué";
              this.message = "Veuillez vous connectez.";
              this.mode = "login";
            }
          });
      } else {
        try {
          const user = {
            email: this.email,
            mdp: this.password,
          };
          await this.$store.dispatch("login", user);
          this.$router.push("/app");
        } catch (err) {
          console.log("Erreur: " + err);
        }

        //this.$router.push("/app");
      }
    },
  },
});
</script>
