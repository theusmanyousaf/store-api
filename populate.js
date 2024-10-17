require('dotenv').config()

const connectDB = require('./db/connect')
const ProductsModel = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await ProductsModel.deleteMany()
        await ProductsModel.create(jsonProducts)
        console.log("Success!!!");
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()