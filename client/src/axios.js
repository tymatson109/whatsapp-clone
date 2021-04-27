import axios from 'axios';

//Heroku https://whatsapp-clone2.herokuapp.com/

const instance = axios.create({
    baseURL: 'https://whatsapp-clone2.herokuapp.com/'
})

export default instance;