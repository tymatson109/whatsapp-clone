import mongoose from 'mongoose'

const authenticationSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: String,
})

export default mongoose.model('users', authenticationSchema)