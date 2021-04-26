import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    name: String,
    image: String,
    id: String,
})

export default mongoose.model('chatnames', whatsappSchema)