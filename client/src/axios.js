import axios from 'axios';

//Heroku https://whatsapp-clone2.herokuapp.com/

const instance = axios.create({
    baseURL: 'http://localhost:9000'
})

export default instance;