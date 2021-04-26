import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    image: String,
    id: String,
})

export default mongoose.model('messagecontents', whatsappSchema)