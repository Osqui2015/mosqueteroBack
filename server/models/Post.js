import mongoose from 'mongoose'

const posSchema = new mongoose.Schema({
    artist:{
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        public_id: String
    },
    imageslider: {
        type: String,
        trim: true
    },
    state: {
        type: String,        
        trim: true
    },
    show: {
        type: String,
        required: true,
        trim: true
    },
    blog: {
        type: String,
        required: true,
        trim: true
    },
    favorite:{
            type: String,            
            trim: true
    }
})


export default mongoose.model('Post', posSchema)