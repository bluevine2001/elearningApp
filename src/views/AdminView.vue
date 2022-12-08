<template>
  <v-dialog v-model="showUser">
    <UserProfile
      admin="true"
      @close-profile="showUser = false"
      :userid="selectedUser"
    ></UserProfile>
  </v-dialog>
  <v-dialog v-model="openAddChanel">
    <AdminAddChanel
      @close-chanel="openAddChanel = false"
      :server="selectedServ"
    ></AdminAddChanel>
  </v-dialog>
  <v-dialog v-model="openAddCourse">
    <AdminAddCourse
      @close-course="openAddCourse = false"
      :server="selectedServ"
    ></AdminAddCourse>
  </v-dialog>
  <v-app-bar elevation="1">
    <v-app-bar-nav-icon><v-icon>fas fa-gauge-high</v-icon></v-app-bar-nav-icon>
    <v-app-bar-title>Dashboard</v-app-bar-title>
    <template v-slot:append>
      <v-btn @click="$router.push('/app')" class="bg-white mr-2">
        <v-icon icon="fas fa-circle-xmark" class="mr-2"></v-icon> Quitter le
        Dashboard</v-btn
      >
    </template>
  </v-app-bar>
  <v-navigation-drawer permanent>
    <v-text-field
      label="Rechercher un utilisateur..."
      v-model="Search"
    ></v-text-field
    ><v-container class="d-flex justify-center">
      <v-btn @click="research">Rechercher</v-btn>
    </v-container>

    <v-list>
      <v-list-item
        v-for="member in members"
        :key="member.id"
        prepend-icon="fas fa-user"
        :title="member.prenom + ' ' + member.nom"
        @click="showProfile(member.id)"
      >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-card class="my-2 mx-2">
    <v-card-title>Les Serveurs</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="serveur in serveurs"
          :key="serveur.id"
          :title="serveur.nom"
        >
          <template v-slot:append>
            <v-btn
              class="mr-2 bg-primary"
              variant="outlined"
              @click="addChanelModal(serveur.id)"
              >Ajouter une chaine</v-btn
            >
            <v-btn variant="outlined" @click="addCourseModal(serveur.id)"
              >Ajouter un cours</v-btn
            >
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
  <AdminEditCourses></AdminEditCourses>
  <!-- (admin) afficher la liste des élèves , 
  barre de recherche pour chercher un élève,  
  modifier le role de l'élève sélectionné, 
  ajouter/ modifier des cours, chapitre -->
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import UserProfile from "@/components/userProfile.vue";
import AdminAddChanel from "@/components/adminAddChanel.vue";
import AdminAddCourse from "@/components/adminAddCourse.vue";
import AdminEditCourses from "@/components/adminEditCourses.vue";

export default defineComponent({
  name: "LoginView",
  components: {
    UserProfile,
    AdminAddChanel,
    AdminAddCourse,
    AdminEditCourses,
  },
  data() {
    return {
      members: [],
      serveurs: [],
      selectedServ: null,
      Search: "",
      openAddChanel: false,
      openAddCourse: false,
      showUser: false,
      selectedUser: null,
    };
  },
  async created() {
    const reqservs = await axios.get(
      "http://localhost:3000/getAllServers/" + this.Search,
      {
        headers: { Authorization: "Bearer " + this.$store.state.token },
      }
    );
    console.log(reqservs);
    if (reqservs.status == 200) {
      this.serveurs = [];
      this.serveurs = reqservs.data;
    }

    const reqmembers = await axios.get(
      "http://localhost:3000/getAllUsers/" + this.Search,
      {
        headers: { Authorization: "Bearer " + this.$store.state.token },
      }
    );
    console.log(reqmembers);
    if (reqmembers.status == 200) {
      this.members = [];
      this.members = reqmembers.data;
    }
  },
  methods: {
    addCourseModal(id) {
      this.selectedServ = id;
      this.openAddCourse = !this.openAddCourse;
    },
    addChanelModal(id) {
      this.selectedServ = id;
      this.openAddChanel = !this.openAddChanel;
    },
    showProfile(id) {
      console.log(id);
      this.selectedUser = id;
      this.showUser = true;
    },
    async research() {
      const req = await axios.get(
        "http://localhost:3000/getUserByName/" + this.Search,
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      if (req.status == 200) {
        this.members = [];
        this.members = req.data;
      }
    },
  },
});
</script>
