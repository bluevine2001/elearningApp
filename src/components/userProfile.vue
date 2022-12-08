<template>
  <v-alert
    :title="title"
    :text="message"
    v-if="message != ''"
    type="success"
  ></v-alert>
  <v-card class="w-50 mx-auto">
    <v-card-title>Mon Profile</v-card-title>
    <v-card-text>
      <v-container>
        <v-row justify="space-around">
          <v-avatar
            icon="fas fa-user"
            class="bg-blue-lighten-2 mb-10"
            size="80"
          ></v-avatar>
        </v-row>
        <v-text-field
          label="Email"
          variant="solo"
          type="email"
          v-model="email"
        ></v-text-field>
        <v-text-field
          label="Pseudo"
          variant="solo"
          v-model="pseudo"
        ></v-text-field>
        <v-text-field label="Nom" variant="solo" v-model="nom"></v-text-field>
        <v-text-field
          label="Prenom"
          variant="solo"
          v-model="prenom"
        ></v-text-field>
        <v-text-field
          label="Mot de passe"
          variant="solo"
          type="password"
          v-model="password"
        ></v-text-field>
        <v-text-field
          label="Rôle"
          variant="solo"
          disabled
          v-model="roleText"
        ></v-text-field>
        <v-text-field
          label="Inscrit depuis le : "
          variant="solo"
          disabled
          v-model="datec"
        ></v-text-field>
      </v-container>
      <v-container v-if="admin == 'true'">
        <v-switch
          color="success"
          label="est professeur ?"
          v-model="boolrole"
          @click="showValue"
        ></v-switch>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn class="float-left ma-2 ml-7" @click="$emit('close-profile')"
        >Annuler</v-btn
      >
      <v-btn class="float-right ma-2 mr-7" @click="saveUserInfo"
        >Enregistrer</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
//import moment from "moment";
export default {
  data() {
    return {
      email: "",
      pseudo: "",
      nom: "",
      prenom: "",
      password: "",
      boolrole: false,
      role: null,
      roleText: "",
      datec: "",
      message: "",
      title: "",
    };
  },
  emits: ["close-profile"],
  async created() {
    console.log(this.userid);
    this.message = "";
    this.title = "";
    const response = await axios.get(
      "http://localhost:3000/getUserById/" + this.userid,
      {
        headers: { Authorization: "Bearer " + this.$store.state.token },
      }
    );
    console.log(response);
    if (response.status == 200) {
      //afficher les infos de l'utilisateur
      this.email = response.data[0].email;
      this.pseudo = response.data[0].pseudo;
      this.nom = response.data[0].nom;
      this.prenom = response.data[0].prenom;
      this.password = response.data[0].mdp;
      if (response.data[0].role == 1) {
        this.roleText = "Elève";
        this.role = 1;
        this.boolrole = false;
      } else {
        this.roleText = "Professeur";
        this.role = 2;
        this.boolrole = true;
      }
      let datec = response.data[0].datec;
      //datec = moment.unix(datec).format("DD/MM/YYYY");
      this.datec = datec;
    }
  },
  props: ["admin", "userid"],
  methods: {
    showValue() {
      if (this.boolrole == true) this.role = 1;
      else this.role = 2;
      console.log(this.role);
    },
    async saveUserInfo() {
      const saveresp = await axios.post(
        "http://localhost:3000/saveUserInfo",
        {
          userid: this.userid,
          email: this.email,
          pseudo: this.pseudo,
          nom: this.nom,
          prenom: this.prenom,
          password: this.password,
          role: this.role,
        },
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      if (saveresp.status == 200) {
        // afficher alerte de bonne sauvegarde
        console.log("test sauvegarde");
        this.message = "Les données ont bien été sauvegardées.";
        this.title = "Sauvegarde Réussie !";
        this.$emit("close-profile");
      }
    },
  },
};
</script>
