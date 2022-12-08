<template>
  <v-card class="mx-2">
    <v-card-title>Modifier Cours</v-card-title>
    <v-btn @click="goBack" variant="text" width="100" v-if="step > 1">
      <v-icon icon="fas fa-chevron-left" class="float-left"></v-icon>
    </v-btn>
    <v-card-text v-if="step == 1">
      <v-list>
        <v-list-item
          v-for="chapter in chapters"
          :key="chapter.id"
          :title="chapter.name"
          @click="selectChapter(chapter.id)"
          link
        >
          <template v-slot:append>
            <v-icon>fas fa-chevron-right</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-text v-if="step == 2">
      <v-list>
        <v-list-item
          v-for="lesson in lessons"
          :key="lesson.id"
          :title="lesson.lessonNumber + ' ' + lesson.lessonTitle"
          @click="selectLesson(lesson)"
          link
        >
          <template v-slot:append>
            <v-icon>fas fa-chevron-right</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-text v-if="step == 3">
      <v-text-field label="titre du cours" v-model="courseName"></v-text-field>
      <v-textarea v-model="course"></v-textarea>
      <v-btn @click="saveCourse">Enregistrer le cours</v-btn>
      <v-btn @click="deleteCourse">Supprimer le cours</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      chapters: [],
      lessons: [],
      step: 1,
      course: "",
      courseid: null,
      courseName: "",
    };
  },
  async created() {
    // get chapters
    const response = await axios.get("http://localhost:3000/getAllChapters/", {
      headers: { Authorization: "Bearer " + this.$store.state.token },
    });
    console.log(response.data);
    this.chapters = response.data;
    // get lessons
  },
  methods: {
    async saveCourse() {
      const response = await axios.post(
        "http://localhost:3000/saveLessonsAdmin",
        {
          id: this.courseid,
          name: this.courseName,
          content: this.course,
        },
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      this.step = 2;
    },
    async deleteCourse() {
      const response = await axios.post(
        "http://localhost:3000/deleteLessonsAdmin",
        {
          id: this.courseid,
        },
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      this.step = 1;
    },
    async selectChapter(chapterId) {
      const response = await axios.post(
        "http://localhost:3000/getLessonsAdmin",
        {
          chapter: chapterId,
        },
        {
          headers: { Authorization: "Bearer " + this.$store.state.token },
        }
      );
      console.log(response);
      this.lessons = response.data;
      this.step = 2;
    },
    selectLesson(lesson) {
      console.log(lesson);
      this.course = lesson.content;
      this.courseName = lesson.lessonTitle;
      this.courseid = lesson.id;

      this.step = 3;
    },
    goBack() {
      //console.log(this.step);
      if (this.step > 1) {
        this.step = this.step - 1;
      } else {
        this.step = 1;
      }
    },
  },
};
</script>
