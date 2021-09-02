require('dotenv').config()
const express = require('express');
const cors = require("cors");
const WebApi = require('spotify-web-api-node');
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder")

const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json())

  app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new WebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId:  process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken,
    })

spotifyApi
.refreshAccessToken()
.then(data => {
res.json({
    accessToken:data.body.access_Token,
    expiresIn: data.body.expires_In
})      })
    .catch(() => {
        res.sendStatus(400)
    })
    })

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new WebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId:  process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    })

    spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch(err => {
        res.sendStatus(400)
    })
})

app.get("/lyrics", async (req, res) => {
    const lyrics = 
    (await lyricsFinder(req.query.artist, req.query.track)) || "Lyrics Unavailable for this Song"
    res.json({lyrics})
})

app.listen(3001)