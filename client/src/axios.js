import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://whatsapp-clone2.herokuapp.com/' || "localhost:8000"
})

export default instance;