require('dotenv').config()
require('express-async-errors') // async errors


const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json())

//routes

app.get('/', (req,res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/Products">Products Route</a>')
})

// products routes

app.use('/api/v1/Products', productsRouter )

app.use(notFoundMiddleware)
app.use(errorMiddleware)


const start = async () => {
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI)
    } catch (error) {
        console.log(error);
    }
}

start();

module.exports = app;