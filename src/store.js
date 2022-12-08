import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state() {
    return {
      userid: null,
      isloggedin: false,
      token: null,
      pseudo: null,
      role: null,
      serveursOfUser: [],
    };
  },
  mutations: {
    login(state, login) {
      state.userid = login.userid;
      state.token = login.token;
      state.pseudo = login.pseudo;
      state.role = login.role;
      state.isloggedin = true;
    },
    logout(state) {
      state.userid = null;
      state.token = null;
      state.pseudo = null;
      state.role = null;
      state.isloggedin = false;
    },
  },
  actions: {
    setToken(context, token) {
      context.commit("setToken", token);
    },
    tryLogin(context) {
      const token = localStorage.getItem("token");
      const userid = localStorage.getItem("userid");
      const pseudo = localStorage.getItem("pseudo");
      const role = localStorage.getItem("role");
      if (token && userid) {
        context.commit("login", {
          token: token,
          pseudo: pseudo,
          role: role,
          userid: userid,
        });
      }
    },
    async login(context, user) {
      const request = await axios.post("http://localhost:3000/login", {
        email: user.email,
        mdp: user.mdp,
      });
      console.log(request);
      if (request.status == 200) {
        const login = {
          userid: request.data.userId,
          pseudo: request.data.pseudo,
          role: request.data.role,
          token: request.data.token,
        };
        console.log(login.role);
        localStorage.setItem("token", login.token);
        localStorage.setItem("pseudo", login.pseudo);
        localStorage.setItem("role", login.role);
        localStorage.setItem("userid", login.userid);
        context.commit("login", login);
      } else {
        const error = request.message;
        throw error;
      }
    },
    logout(context) {
      localStorage.removeItem("token");
      localStorage.removeItem("userid");
      localStorage.removeItem("pseudo");
      localStorage.removeItem("role");
      context.commit("logout");
    },
  },
  getters: {
    updateServs(state) {
      return state.serveursOfUser;
    },
    isLoggedIn(state) {
      return state.isloggedin;
    },
  },
});
export default store;
