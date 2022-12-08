<template>
  <v-list>
    <v-tooltip :text="this.$store.state.pseudo">
      <template v-slot:activator="{ props }">
        <v-list-item class="pl-3 pb-2" v-bind="props">
          <template v-slot:prepend>
            <v-btn
              @mouseover="hoverme = true"
              @mouseleave="hoverme = false"
              @click="clickmeserv"
              icon="fas fa-user"
              flat
              :class="{
                'bg-purple-darken-1 rounded-lg': hoverme || ismeSelected,
                'bg-grey-darken-1': !hoverme && !ismeSelected,
              }"
            >
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-tooltip>

    <v-divider class="bg-grey-darken-3"></v-divider>

    <!-- v-for list de serveur (classes) ici -->
    <v-tooltip :text="server.nom" v-for="server in servers" :key="server.id">
      <template v-slot:activator="{ props }">
        <v-list-item class="pl-3 pb-2" v-bind="props">
          <template v-slot:prepend>
            <v-btn
              @mouseover="server.servhover = true"
              @mouseleave="server.servhover = false"
              :id="server.id"
              @click="$emit('selected-server', server)"
              :icon="server.icon"
              :class="{
                'bg-purple-darken-1 rounded-lg':
                  server.servhover || server.isSelected,
                'bg-grey-darken-1': !server.servhover && !server.isSelected,
              }"
            >
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-tooltip>

    <v-dialog v-model="dialog">
      <template v-slot:activator="{ props }">
        <v-list-item class="pl-3 py-2" v-bind="props">
          <template v-slot:prepend>
            <v-btn
              @mouseover="hoveradd = true"
              @mouseleave="hoveradd = false"
              icon="mdi:mdi-plus-circle-outline"
              flat
              :class="{
                'bg-grey-darken-1 text-green pa-2': !hoveradd,
                'bg-green text-white rounded-lg': hoveradd,
              }"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
      <v-card width="440" class="mx-auto">
        <v-card-title class="mx-auto">
          <span class="text-h4 font-weight-bold">Ajouter un serveur</span>
        </v-card-title>
        <v-card-text>
          <v-container v-if="step == 1">
            <v-row>
              <v-col cols="12">
                <v-btn
                  append-icon="mdi:mdi-chevron-right"
                  width="100%"
                  @click="step = 2"
                >
                  Créer un serveur
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn
                  append-icon="mdi:mdi-chevron-right"
                  width="100%"
                  @click="step = 3"
                >
                  Rejoindre un serveur
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-container v-if="step == 2">
            <v-text-field
              placeholder="Nom du serveur"
              v-model="serverName"
            ></v-text-field>
            <v-btn @click="step = 1" variant="text" color="red">Retour</v-btn>
            <v-btn @click="CreateNewServer">Créer</v-btn>
          </v-container>
          <v-container v-if="step == 3">
            <v-text-field
              placeholder="Identifiant du serveur"
              v-model="serverName"
            ></v-text-field>
            <v-btn @click="step = 1" variant="text" color="red">Retour</v-btn>
            <v-btn @click="$emit('join-server', serverName)">Rejoindre</v-btn>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red-darken-1"
            variant="text"
            @click="(step = 1), (dialog = false)"
          >
            Annuler
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-tooltip text="Découvrir" color="yellow">
      <template v-slot:activator="{ props }">
        <v-list-item class="pl-3 py-2" v-bind="props">
          <template v-slot:prepend>
            <v-btn
              @mouseover="hoverfind = true"
              @mouseleave="hoverfind = false"
              @click="$emit('show-discover')"
              icon="mdi:mdi-compass"
              flat
              :class="{
                'bg-grey-darken-1 text-green pa-2': !hoverfind,
                'bg-green text-white rounded-lg': hoverfind,
              }"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-tooltip>

    <v-tooltip text="Se Déconnecter" color="yellow">
      <template v-slot:activator="{ props }">
        <v-list-item class="pl-3 py-2" v-bind="props">
          <template v-slot:prepend>
            <v-btn
              @mouseover="hoverleave = true"
              @mouseleave="hoverleave = false"
              @click="logout"
              icon="mdi:mdi-logout"
              flat
              :class="{
                'bg-grey-darken-1 text-red pa-2': !hoverleave,
                'bg-red text-white rounded-lg': hoverleave,
              }"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-tooltip>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      hoverme: false,
      hoveradd: false,
      hoverfind: false,
      hoverleave: false,
      dialog: false,
      step: 1,
      serverName: "",
      ismeSelected: false,
    };
  },
  props: ["servers"],
  emits: [
    "add-new-serv",
    "seected-server",
    "show-profile",
    "join-server",
    "show-discover",
  ],
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/");
    },
    CreateNewServer() {
      const newServer = {
        ownerid: this.$store.state.userid,
        servicon: "mdi:mdi-discord",
        servname: this.serverName,
        servhover: false,
        isSelected: false,
      };
      this.serverName = "";
      this.$emit("add-new-serv", newServer);
      this.step = 1;
      this.dialog = false;
    },
    clickmeserv() {
      this.$emit("show-profile");
    },
  },
};
</script>
