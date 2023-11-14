import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'

import viewsRouter from './routes/views.routes.js'
import { __dirname } from './utils.js'

const PORT = 5000

const app = express()
const httpServer = app.listen(PORT, () => {
    console.log(`Servicio activo en puerto ${PORT}`)
})

const chat_messages = []
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    } 
})

io.on('connection', socket => {
    socket.on('user_connected', data => {
        socket.broadcast.emit('user_connected', {user: data.user})
    })

    socket.on('message', data => {
        chat_messages.push(data)
        io.emit('messageLogs', chat_messages)
    })
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars' , handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.set('io', io)

app.use('/', viewsRouter)

app.use('/static', express.static(`${__dirname}/public`))