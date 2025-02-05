const mongoose = require('mongoose')

const connectDb = async ()=> {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        .then(()=>{
            console.log('connection successfull')
        })
        .catch((error)=>{
            console.log('connection successfull', error)

        })
    } catch (error) {
        console.log(`mongodb connection fail`)
        process.exit(1)
    }
}

module.exports = connectDb