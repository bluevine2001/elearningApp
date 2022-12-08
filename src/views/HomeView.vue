<template>
  <v-dialog v-model="showCourses">
    <Courses :serv="selectedServer"></Courses>
  </v-dialog>

  <v-dialog v-model="showDiscover">
    <DiscoverModal @refreshServers="getServers"></DiscoverModal>
  </v-dialog>

  <v-dialog v-model="showProfile">
    <UserProfile
      @close-profile="showProfile = false"
      admin="false"
      :userid="this.$store.state.userid"
    ></UserProfile>
  </v-dialog>

  <v-dialog v-model="showAddChanel">
    <AddChanel
      @close-add-chanel="showAddChanel = false"
      @saved-close-add-chanel="reloadChanels"
      :servid="selectedServer.id"
    ></AddChanel>
  </v-dialog>

  <v-navigation-drawer width="72" color="grey-darken-4" permanent>
    <Servers
      @add-new-serv="addserve"
      @selected-server="dispchanels"
      @show-profile="showProfile = true"
      @join-server="joinServ"
      @show-discover="showDiscover = !showDiscover"
      :servers="addedServers"
    />
  </v-navigation-drawer>
  <v-navigation-drawer width="240" color="grey-darken-3" permanent>
    <Channels
      :from="currentchanels"
      :servname="selectedServer.nom"
      :owner="selectedServer.owner"
      @selected-chanel="selectChanel"
      @add-chanel="showAddModal"
      @leave-serv="leaveServ"
    />
  </v-navigation-drawer>
  <v-app-bar height="48" color="grey-darken-2" elevation="0">
    <v-app-bar-title>{{ nameintopbar }}</v-app-bar-title>
    <v-btn v-if="isProf" @click="$router.push('/admin')" class="bg-white mr-2">
      <v-icon icon="fas fa-gauge-high" class="mr-2"></v-icon> Dashboard</v-btn
    >
    <v-btn
      v-if="selectedServer != ''"
      @click="showCourses = !showCourses"
      variant="outlined"
      ><v-icon icon="mdi:mdi-brain"></v-icon> Cours</v-btn
    >
  </v-app-bar>
  <div class="bg-grey-darken-1 h-100 rounded-0 pa-5">
    <h1>{{ selectedChanel.nom }}</h1>
    <v-list lines="three" class="bg-grey-darken-1">
      <v-list-item
        v-for="msg in msgtab"
        :key="msg.id"
        :title="msg.fromuser"
        :subtitle="msg.content"
      >
        <template v-slot:prepend>
          <v-icon icon="fas fa-user" class="mt-4" size="small"></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </div>
  <v-navigation-drawer
    location="right"
    width="240"
    color="grey-darken-3"
    permanent
  >
    <v-list v-if="selectedServer != ''">
      <v-list-item v-for="member in members" :key="member.id" class="d-flex">
        <template v-slot:prepend>
          <v-icon icon="fas fa-user" size="small"></v-icon>
        </template>
        <v-list-item-title>
          {{ member.prenom + " " + member.nom }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar location="bottom" height="68" color="grey-darken-2" elevation="0">
    <MsgInput
      class="mx-10 rounded-lg mt-5"
      @send-msg="sendMsg"
      :chanel="selectedChanel"
      v-if="selectedChanel != ''"
    />
  </v-app-bar>
</template>

<script>
import { defineComponent } from "vue";
//import { io } from "socket.io-client";

//const socket = io("http://localhost:3000");

// Components
import Servers from "@/components/servers.vue";
import Channels from "@/components/channels.vue";
import MsgInput from "@/components/msginput.vue";
import Courses from "@/components/courses.vue";
import axios from "axios";
import DiscoverModal from "@/components/discoverModal.vue";
import UserProfile from "@/components/userProfile.vue";
import AddChanel from "@/components/addChanel.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    Servers,
    Channels,
    MsgInput,
    Courses,
    DiscoverModal,
    UserProfile,
    AddChanel,
  },
  data() {
    return {
      addedServers: [],
      currentchanels: [],
      selectedServer: "",
      newmsg: [],
      selectedChanel: "",
      msgtab: [],
      showCourses: false,
      showProfile: false,
      showDiscover: false,
      members: [],
      showAddChanel: false,
      addChanelId: null,
    };
  },
  computed: {
    nameintopbar() {
      if (this.selectedChanel != "") {
        return this.selectedChanel.nom;
      } else if (this.selectedServer != "") {
        return this.selectedServer.name;
      } else {
        return "";
      }
    },
    isProf() {
      if (this.$store.state.role == 2) {
        return true;
      } else {
        return false;
      }
    },
  },
  async created() {
    this.addedServers = [];
    console.log("dans la fonction " + this.$store.state.userid);
    let req = await axios.get(
      "http://localhost:3000/servers/of/" + this.$store.state.userid,
      {
        headers: { Authorization: "Bearer " + this.$store.state.token },
      }
    );
    //console.log(req);
    if (req.data.ids != null) {
      let ids = req.data.ids;
      if (Array.isArray(ids)) {
        //ids = ids.split("|");
        ids.forEach((id) => {
          axios
            .get("http://localhost:3000/servers/" + id, {
              headers: { Authorization: "Bearer " + this.$store.state.token },
            })
            .then((response) => {
              const serv = response.data[0];
              //console.log(serv);
              this.addedServers.push(serv);
            });
        });
      } else if (ids != null) {
        axios
          .get("http://localhost:3000/servers/" + ids, {
            headers: { Authorization: "Bearer " + this.$store.state.token },
          })
          .then((response) => {
            const serv = response.data[0];
            //console.log(serv);
            this.addedServers.push(serv);
          });
      }
    }
  },
  methods: {
    // on charge les serveurs de l'utilisateur dans l'interface.
    async getServers() {
      this.addedServers = [];
      console.log("dans la fonction " + this.$store.state.userid);
      let req = await axios.get(
        "http://localhost:3000/servers/of/" + this.$store.state.userid,
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      //console.log(req);
      if (req.data.ids != null) {
        let ids = req.data.ids;
        if (Array.isArray(ids)) {
          //ids = ids.split("|");
          ids.forEach((id) => {
            axios
              .get("http://localhost:3000/servers/" + id, {
                headers: { Authorization: "Bearer " + this.$store.state.token },
              })
              .then((response) => {
                const serv = response.data[0];
                //console.log(serv);
                this.addedServers.push(serv);
              });
          });
        } else if (ids != null) {
          axios
            .get("http://localhost:3000/servers/" + ids, {
              headers: { Authorization: "Bearer " + this.$store.state.token },
            })
            .then((response) => {
              const serv = response.data[0];
              //console.log(serv);
              this.addedServers.push(serv);
            });
        }
      }
    },
    async joinServ(servid) {
      const response = await axios.post(
        "http://localhost:3000/join",
        {
          userId: this.$store.state.userid,
          servid: servid,
        },
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      if (response.status == 200) {
        this.getServers();
      }
    },
    showAddModal(servid) {
      this.showAddChanel = true;
      this.addChanelId = servid;
    },
    // on créer un seveur.
    addserve(serv) {
      //this.addedServers.push(serv);
      axios
        .post(
          "http://localhost:3000/servers",
          {
            serveur: serv,
          },
          {
            headers: { Authorization: "Bearer " + this.$store.state.token },
          }
        )
        .then((response) => {
          if (response.status === 401) {
            this.$router.push("/");
          } else {
            const user = {
              userid: this.$store.state.userid,
              token: this.$store.state.token,
            };
            this.$store.dispatch("getServers", user);
            this.getServers();
          }
        });

      //console.log(this.addedServers);
    },
    leaveServ() {
      const serv = this.selectedServer.id;
      const userid = this.$store.state.userid;
      axios
        .post(
          "http://localhost:3000/leave",
          {
            servid: serv,
            userid: userid,
          },
          {
            headers: { Authorization: "Bearer " + this.$store.state.token },
          }
        )
        .then((response) => {
          console.log(response);
          this.getServers();
        });
    },
    reloadChanels() {
      this.showAddChanel = false;
      this.dispchanels(this.selectedServer);
    },
    //quand on clique sur un serveur, on affiche ses chaines
    async dispchanels(server) {
      if (this.currentchanels.length > 0) {
        this.currentchanels = [];
      }
      if (this.selectedChanel != "") {
        this.selectedChanel = "";
      }
      if (this.newmsg.length > 0) {
        this.newmsg = [];
      }
      if (this.msgtab.length > 0) {
        this.msgtab = [];
      }
      this.members = [];
      this.showCourses = false;
      this.showProfile = false;
      axios
        .get("http://localhost:3000/chanels/" + server.id, {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        })
        .then((response) => {
          if (response.status === 401) {
            this.$router.push("/");
          } else {
            //console.log(response.data);
            let chanels = response.data;
            chanels.forEach((chanel) => {
              this.currentchanels.push(chanel);
            });
          }
        });
      this.selectedServer = server;

      const responseMembers = await axios.get(
        "http://localhost:3000/getMembers/" + server.id,
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      console.log(responseMembers);
      if (responseMembers.status == 200) {
        this.members = responseMembers.data;
      }
    },
    async sendMsg(msg, chan) {
      //console.log(msg, chan.id);
      const response = axios.post(
        "http://localhost:3000/newmsg",
        {
          message: msg,
          idchanel: chan.id,
          userid: this.$store.state.pseudo,
        },
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      if (response.status == 200) {
        this.getMsg(chan);
      }
      //console.log("ok");
    },
    async getMsg(chan) {
      const response = await axios.get(
        "http://localhost:3000/getMsg/" + chan.id,
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      if (response.status == 200) {
        this.msgtab = response.data;
      }
    },
    async selectChanel(chanel) {
      console.log(chanel);
      if (this.newmsg.length > 0) {
        this.newmsg = [];
      }
      if (this.msgtab.length > 0) {
        this.msgtab = [];
      }
      this.selectedChanel = chanel;
      //socket.emit()
      console.log(this.selectedChanel);

      axios
        .get("http://localhost:3000/displaychanel/" + chanel.id, {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        })
        .then((response) => {
          if (response.status === 401) {
            this.$router.push("/");
          } else {
            console.log(response);
            response.data.forEach((msg) => {
              this.msgtab.push(msg);
            });
          }
        });
    },
  },
});
</script>

<style scoped>
.v-list-item__prepend {
  align-self: auto !important;
}
</style>
