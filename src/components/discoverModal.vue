<template>
  <v-card width="600" class="mx-auto">
    <v-card-title
      ><v-icon icon="fas fa-server" class="mr-2"></v-icon
      >Découvrir</v-card-title
    >
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="server in servers"
          :key="server.id"
          :title="server.nom"
          @click="joinDiscoveredServer(server.id)"
          link
          class="bg-blue-darken-1"
        >
          <template v-slot:append>
            <v-btn color="white" @click="joinServ(server.id)"
              ><v-icon icon="fas fa-plus" class="bg-black-lighten-1"></v-icon
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      servers: [],
    };
  },
  async created() {
    const response = await axios.get(
      "http://localhost:3000/discover/" + this.$store.state.userid,
      {
        headers: { Authorization: "Bearer " + this.$store.state.token },
      }
    );
    console.log(response);
    if (response.status == 200) {
      this.servers = response.data;
    }
  },
  methods: {
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
      console.log(response);
      if (response.status == 200) {
        this.$emit("refreshServers");
      }
    },
  },
};
</script>
