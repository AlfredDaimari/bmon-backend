const express = require('express')
const cors = require('cors')
const http = require("http")

const invoke = require('./invokeBknd')
const register = require('./registerBknd')
const query = require('./queryBknd')

const app = express()
app.use(cors())


// all routes for the backend

// * login
app.post('/login/:username', async (req, res) => {
    try {
        const valid = await invoke("login", req.params["username"])
        if (valid) {
            res.status(201).send("success: user exist")
        } else {
            res.status(400).send("error:user does not exist")
        }
    } catch (e) {
        console.log(e)
        res.status(400).send("error:user does not exist")
    }
})

// * creating user and send hello transaction
app.post('/register/:username', async (req, res) => {
    try {
        let valid = await register(req.params["username"])
        if (!valid) {
            res.status(400).send(new Error("error:user could not be created"))
        }
        valid = await invoke("hello", req.params["username"], req.params["username"])
        if (valid) {
            res.status(200).send("success: user created")
        } else {
            res.status(500).send("error:something happened")
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("error:something happened")
    }
})

// * for request voting
app.post('/votereq/:username/:id', async (req, res) => {
    try {
        let valid = await invoke("voteforrequest", req.params["username"], req.params["id"])
        if (!valid) {
            res.status(400).send(new Error("error:could not vote for request"))
        } else {
            res.status(200).send("success:voted for request")
        }

    } catch (e) {
        console.log(e)
        res.status(500).send("error:something happened")
    }
})


// * for querying the backend
app.post('/query/:username/:id', async (req, res) => {
    try {
        let resp = await query(req.params["username"], parseInt(req.params["id"]))
        console.log(resp)
        res.status(200).send(resp)
    } catch (e) {
        console.log(e)
        res.status(500).send("error:something happened")
    }
})

// * for accepting and rejecting trade
app.post('/trade/:username/:id/:decision', async (req, res) => {
    try {
        let valid = await invoke('updaterequest', req.params["username"], parseInt(req.params["id"]), "", req.params["decision"])
        if (!valid) {
            res.status(400).send(new Error("error:could not decide on trade"))
        } else {
            res.status(200).send("success:decided on trade")
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("error:something happened")
    }
})

//  * coin request
app.post('/coin/:username/:user1/:user2/:rew', async (req, res) => {
    try {
        let valid = await invoke('coinrequest', req.params["username"], parseInt(req.params["user1"]), req.params["user2"], req.params["rew"])
        if (!valid) {
            res.status(400).send(new Error("error:could not decide on trade"))
        } else {
            res.status(200).send("success:decided on trade")
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("error:something happened")
    }
})

// * for updating coin request
app.post('/coin/:username/:id/:winner', async (req, res) => {
    try {
        let valid = await invoke('updaterequest', req.params["username"], parseInt(req.params["id"]), req.params["winner"], "yes")
        if (!valid) {
            res.status(400).send(new Error("error:could not decide on trade"))
        } else {
            res.status(200).send("success:decided on trade")
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("error:something happened")
    }
})


// * buying items (coins need to be strings)
app.post('/buy/:username/:id/:coins', async (req, res) => {
    try {
        console.log(req.params["coins"])
        let valid = await invoke('buyasset', req.params["username"], parseInt(req.params["id"]), req.params["coins"])
        if (!valid) {
            res.status(400).send(new Error("error:could not buy item"))
        } else {
            res.status(200).send("success:bought item")
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("error:something happened")
    }
})


// * add new trade-request
app.post('/trade/:username/:p2/:uitems/:p2items', async (req, res) => {
    try {
        let valid = await invoke("traderequest", req.params["username"], req.params["p2"], req.params["uitems"], req.params["p2items"])
        if (!valid) {
            res.status(400).send(new Error("error:could not make trade request"))
        } else {
            res.status(200).send("success:made trade request")
        }

    } catch (e) {
        console.log(e)
        res.status(500).send("error:something happened")
    }
})


server = http.createServer(app)

module.exports = server