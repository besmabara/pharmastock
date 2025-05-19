import axios from "axios";

const token = localStorage.getItem("token") || null;
console.log(token);

const instance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export default instance;
