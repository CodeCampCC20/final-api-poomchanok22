import express from 'express'
import cors from 'cors'
import errorMiddleware from './middlewares/error.middleware.js'
import notFoundMiddleware from './middlewares/not-found.js'
import authRouter from './routes/auth.route.js'
import authRouterDoc from './routes/authUser.route.js'


const app = express()
app.use(express.json())
app.use(cors())

app.use(authRouter)
app.use(authRouterDoc)

app.use(notFoundMiddleware)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server is running ${PORT}`))

