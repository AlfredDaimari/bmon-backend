// file for socket server

const _ = require("lodash")
const server = require('./server')

// setting up socket server
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});
console.log("=====socket server is up and running=====")

// Note: only use main server to emit, do emit from user to user
var users = {

}

io.on("connection", (socket) => {

    console.log("New client connected");

    // on getting assets, emit it out to all other users
    socket.on("client:info", info => {

        if (!(info.account in users)) {
            users[info.account] = info.assets
            socket.broadcast.emit("client:update-users", users)
            console.log(users)
        }

        let account = users[info.account]
        // now compare the assets in both account
        account = _.sortBy(account, [function (o) { return o.Key }])
        info.assets = _.sortBy(info.assets, [function (o) { return o.Key }])

        if (!(_.isEqual(account, info.assets))) {
            users[info.account] = info.assets
            socket.broadcast.emit("client:update-users", users)
            console.log(users)
        }

    })

    // on getting new_connection, emit back out info of gathering hub
    socket.on("client:new_connect", account => {
        console.log("connected client: " + account)
        socket.emit("client:update-users", users)
    })

    socket.on("client:disconnect", account => {
        console.log("disconnected client:" + account)
        delete users[account]
        console.log(users)
        socket.broadcast.emit("client:update-users", users)
    })

    // broadcasting to all users when a trade request has been made
    socket.on("client:tradereq", account => {
        console.log("trade-request: " + account)
        socket.broadcast.emit("client:tradereq", account)
    })

});

module.exports = server