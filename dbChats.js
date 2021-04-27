import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    name: String,
    image: String,
    id: String,
    members: Object,
})

export default mongoose.model('chatnames', whatsappSchema)