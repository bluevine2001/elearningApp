<template>
  <v-card>
    <v-card-title>Ajouter un cours</v-card-title>
    <v-card-text>
      <v-select
        label="Matière/Thème"
        :items="chapters"
        v-model="chapter"
        item-title="name"
        item-value="id"
      ></v-select>
      <v-text-field label="Nom du cours" v-model="courseName"></v-text-field>
      <v-text-field label="Cours n°" v-model="courseNumber"></v-text-field>
      <v-textarea
        label="Contenue du cours"
        v-model="courseContent"
      ></v-textarea>
      <v-switch
        label="Ajouter quiz ?"
        v-model="hasQuiz"
        color="success"
        inset
      ></v-switch>
    </v-card-text>
    <v-card-text v-if="hasQuiz">
      <v-text-field label="Question 1 :" v-model="q1"></v-text-field>
      <v-text-field label="Réponse n°1" v-model="qa1[0]">
        <template v-slot:append>
          <v-checkbox v-model="qc1" value="1"></v-checkbox>
        </template>
      </v-text-field>
      <v-text-field label="Réponse n°2" v-model="qa1[1]">
        <template v-slot:append>
          <v-checkbox v-model="qc1" value="2"></v-checkbox>
        </template>
      </v-text-field>
      <v-text-field label="Réponse n°3" v-model="qa1[2]">
        <template v-slot:append>
          <v-checkbox v-model="qc1" value="3"></v-checkbox>
        </template>
      </v-text-field>

      <v-text-field label="Question 2 :" v-model="q2"> </v-text-field>
      <v-text-field label="Réponse n°1" v-model="qa2[0]">
        <template v-slot:append>
          <v-checkbox v-model="qc2" value="1"></v-checkbox>
        </template>
      </v-text-field>
      <v-text-field label="Réponse n°2" v-model="qa2[1]">
        <template v-slot:append>
          <v-checkbox v-model="qc2" value="2"></v-checkbox>
        </template>
      </v-text-field>
      <v-text-field label="Réponse n°3" v-model="qa2[2]">
        <template v-slot:append>
          <v-checkbox v-model="qc2" value="3"></v-checkbox>
        </template>
      </v-text-field>

      <v-text-field label="Question 3 :" v-model="q3"></v-text-field>
      <v-text-field label="Réponse n°1" v-model="qa3[0]">
        <template v-slot:append>
          <v-checkbox v-model="qc3" value="1"></v-checkbox>
        </template>
      </v-text-field>
      <v-text-field label="Réponse n°2" v-model="qa3[1]">
        <template v-slot:append>
          <v-checkbox v-model="qc3" value="2"></v-checkbox>
        </template>
      </v-text-field>
      <v-text-field label="Réponse n°3" v-model="qa3[2]">
        <template v-slot:append>
          <v-checkbox v-model="qc3" value="3"></v-checkbox>
        </template>
      </v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn class="float-left ma-2 ml-7" @click="$emit('close-course')"
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
      chapters: [
        { name: "Business Mastery", id: 1 },
        { name: "SSS", id: 2 },
        { name: "Financial Wizardy", id: 3 },
        { name: "Personal Finance", id: 4 },
        { name: "Freelancing", id: 5 },
      ],
      serverid: this.server,
      chapter: null,
      courseName: "",
      courseNumber: null,
      courseContent: "",
      hasQuiz: false,
      q1: null,
      q2: null,
      q3: null,
      qa1: [],
      qa2: [],
      qa3: [],
      qc1: [],
      qc2: [],
      qc3: [],
    };
  },
  props: ["server"],
  methods: {
    async saveInfos() {
      console.log(this.chapter);
      const reqCourses = await axios.post(
        "http://localhost:3000/addLessons",
        {
          servid: this.serverid,
          chapterid: this.chapter,
          lessonNumber: this.courseNumber,
          lessonContent: this.courseContent,
          lessonTitle: this.courseName,
          hasQuiz: this.hasQuiz,
          q1: this.q1,
          q2: this.q2,
          q3: this.q3,
          a11: this.qa1[0],
          a12: this.qa1[1],
          a13: this.qa1[2],
          a21: this.qa2[0],
          a22: this.qa2[1],
          a23: this.qa2[3],
          a31: this.qa3[0],
          a32: this.qa3[1],
          a33: this.qa3[2],
          ca1: this.qc1[0],
          ca2: this.qc2[0],
          ca3: this.qc3[0],
        },
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      console.log(reqCourses);
      if (reqCourses.status == 200) {
        this.$emit("close-course");
      }
    },
  },
};
</script>
