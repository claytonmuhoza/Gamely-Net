import axios from "axios";

export const api = axios.create({
    //load base url from .env file
    baseURL: "https://localhost:7194/",
})