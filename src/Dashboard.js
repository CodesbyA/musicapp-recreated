import { Container, Form } from 'react-bootstrap';
import useAuth from './useAuth';
import { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import TrackSearchResults from './TrackSearchResults';
import Player from './Player';
import axios from 'axios';


const spotifyApi = new SpotifyWebApi({
    clientId: "853556b1fbc44f33b98fab9d95d8eca9",
})

export default function Dashboard ({code}){
const accessToken = useAuth(code)
const [search, setSearch] = useState("")
const [searchResults, setSearchResults] = useState([])
const [currentTrack, setCurrentTrack] = useState()
const [lyrics, setLyrics] = useState("")

function chooseTrack(track) {
    setCurrentTrack(track)
    setSearch("")
    setLyrics("")
}

useEffect(() => {
    if(!currentTrack) return

    axios
    .get("https://musicapiapp.herokuapp.com/lyrics", {
        params: {
            track: currentTrack.title,
            artist: currentTrack.artist,
        }
    }).then(res => {
        setLyrics(res.data.lyrics)
    })
}, [currentTrack])

useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
}, [accessToken])

useEffect(() => {
if(!search) return setSearchResults([])
if(!accessToken) return 

let cancel = false
spotifyApi.searchTracks(search).then(res => {
    if(cancel) return
    setSearchResults(res.body.tracks.items.map(track => {
        const smallestImage = track.album.images.reduce(
            (smallest, image) => {
                if(image.height < smallest.height) return image
                return smallest
            }, track.album.images[0])

        return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestImage.url
        }
    }))
})

return () => cancel = true

}, [search, accessToken])

    return (
    <Container className="d-flex flex-column py-2" style={{height: "100vh"}}>
        <Form.Control 
        type="search" 
        placeholder="Search Music" 
        value={search} 
        onChange={e=> setSearch(e.target.value)} />


        <div className="flex-grow-1 my-2" style={{overflowY: "auto"}}>
            {searchResults.map(track => (
                <TrackSearchResults 
                track = {track} 
                key={track.uri} 
                chooseTrack= {chooseTrack}
                />
            ))}

                {searchResults.length === 0 && (
               <div className="text-center" style={{ whiteSpace: "pre"}}>
                   {lyrics}
                   </div>
           )}
             

           </div>
        <div>
            <Player accessToken={accessToken} trackUri={currentTrack?.uri} />
        </div>
        </Container>
    )
 
}
