const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on("send frame", frame => {
    socket.broadcast.emit("display frame", {frame, id: socket.id})
  })
  
  socket.on("disconnect", () => {
    socket.broadcast.emit("socket disconnecting", {id: socket.id})
  })
});



// app.get("/", (req, res) => {
//   res.send("hello")
//   console.log("here")
// })

const listener = server.listen(process.env.PORT, () => {
  console.log(`server running at port http://localhost/${listener.address().port}`)
})

