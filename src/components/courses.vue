<template>
  <v-card>
    <v-card-title
      ><v-icon icon="mdi:mdi-school"></v-icon> Learning Center</v-card-title
    >
    <v-btn @click="goBack" variant="text" width="100">
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
          @click="selectLesson(lesson.id)"
          link
        >
          <template v-slot:append>
            <v-icon>fas fa-chevron-right</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-text v-if="step == 3">
      <p>{{ course }}</p>
      <v-btn v-if="hasquiz == true" @click="doQuizz">
        <v-icon icon="fas fa-chevron-right"></v-icon>
      </v-btn>
    </v-card-text>
    <v-card-text v-if="step == 4">
      <h1>Quiz :</h1>
      <br />
      <div class="question1" v-if="questions[0] != null">
        <h2>{{ questions[0] }} :</h2>
        <v-list>
          <v-list-item link>
            <v-checkbox value="1" v-model="q1a"></v-checkbox>
            {{ q1answers[0] }}
          </v-list-item>
          <v-list-item link>
            <v-checkbox value="2" v-model="q1a"></v-checkbox>
            {{ q1answers[1] }}
          </v-list-item>
          <v-list-item link>
            <v-checkbox value="3" v-model="q1a"></v-checkbox>
            {{ q1answers[2] }}
          </v-list-item>
        </v-list>
      </div>
      <div class="question2" v-if="questions[1] != null">
        <h2>{{ questions[1] }} :</h2>
        <v-list>
          <v-list-item link>
            <v-checkbox value="1" v-model="q2a"></v-checkbox>
            {{ q2answers[0] }}
          </v-list-item>
          <v-list-item link>
            <v-checkbox value="2" v-model="q2a"></v-checkbox>
            {{ q2answers[1] }}
          </v-list-item>
          <v-list-item link>
            <v-checkbox value="3" v-model="q2a"></v-checkbox>
            {{ q2answers[2] }}
          </v-list-item>
        </v-list>
      </div>
      <div class="question3" v-if="questions[2] != null">
        <h2>{{ questions[2] }} :</h2>
        <v-list>
          <v-list-item link>
            <v-checkbox value="1" v-model="q3a"></v-checkbox>
            {{ q3answers[0] }}
          </v-list-item>
          <v-list-item link>
            <v-checkbox value="2" v-model="q3a"></v-checkbox>
            {{ q3answers[1] }}
          </v-list-item>
          <v-list-item link>
            <v-checkbox value="3" v-model="q3a"></v-checkbox>
            {{ q3answers[2] }}
          </v-list-item>
        </v-list>
      </div>
      <v-btn @click="validAnswers">
        Envoyer
        <v-icon icon="fas fa-chevron-right"></v-icon>
      </v-btn>
    </v-card-text>
    <v-card-text v-if="step == 5">
      <h2>Quiz terminé, votre score est de: {{ score }} / 3</h2>
      <v-progress-circular
        :size="100"
        :width="15"
        :model-value="(score / 3) * 100"
        color="green"
      >
        {{ value }}
      </v-progress-circular>
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
      course: "",
      step: 1,
      hasquiz: false,
      questions: [],
      q1answers: [],
      q2answers: [],
      q3answers: [],
      q1ca: 0,
      q2ca: 0,
      q3ca: 0,
      q1a: [],
      q2a: [],
      q3a: [],
      score: 0,
    };
  },
  async created() {
    console.log(this.$store.state.token);
    const servid = this.serv.id;
    const response = await axios.get(
      "http://localhost:3000/getChapters/" + servid,
      {
        headers: { Authorization: "Bearer " + this.$store.state.token },
      }
    );
    console.log(response.data);
    this.chapters = response.data;
  },
  methods: {
    async selectChapter(chapterId) {
      const servid = this.serv.id;
      const response = await axios.post(
        "http://localhost:3000/getLessons",
        {
          servid: servid,
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
    selectLesson(lessonId) {
      this.course = this.lessons[lessonId - 1].content;
      if (this.lessons[lessonId - 1].hasQuiz == 1) {
        console.log("yeeaaah");
        this.hasquiz = true;
        if (this.lessons[lessonId - 1].q1 != null) {
          this.questions.push(this.lessons[lessonId - 1].q1);
          this.q1answers.push(this.lessons[lessonId - 1].a11);
          this.q1answers.push(this.lessons[lessonId - 1].a12);
          this.q1answers.push(this.lessons[lessonId - 1].a13);
          this.q1ca = this.lessons[lessonId - 1].ca1;
        }
        if (this.lessons[lessonId - 1].q2 != null) {
          this.questions.push(this.lessons[lessonId - 1].q2);
          this.q2answers.push(this.lessons[lessonId - 1].a21);
          this.q2answers.push(this.lessons[lessonId - 1].a22);
          this.q2answers.push(this.lessons[lessonId - 1].a23);
          this.q2ca = this.lessons[lessonId - 1].ca2;
        }
        if (this.lessons[lessonId - 1].q3 != null) {
          this.questions.push(this.lessons[lessonId - 1].q3);
          this.q3answers.push(this.lessons[lessonId - 1].a31);
          this.q3answers.push(this.lessons[lessonId - 1].a32);
          this.q3answers.push(this.lessons[lessonId - 1].a33);
          this.q3ca = this.lessons[lessonId - 1].ca3;
        }
      }
      this.step = 3;
    },
    doQuizz() {
      this.step = 4;
    },
    validAnswers() {
      this.score = 0;
      if (this.q1a[0] == this.q1ca) {
        this.score = this.score + 1;
      }
      if (this.q2a[0] == this.q2ca) {
        this.score = this.score + 1;
      }
      if (this.q3a[0] == this.q3ca) {
        this.score = this.score + 1;
      }
      this.step = 5;
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
  props: ["serv"],
};
</script>
