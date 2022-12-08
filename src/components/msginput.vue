<template>
  <v-text-field
    label="Message..."
    v-model="message"
    @keyup.enter="sendMsg"
  ></v-text-field>
</template>

<script>
//console.log(server);
export default {
  data() {
    return {
      message: "",
    };
  },
  methods: {
    sendMsg() {
      this.$emit("send-msg", this.message, this.chanel);
      this.message = "";
    },
  },
  props: ["chanel"],
};
</script>
