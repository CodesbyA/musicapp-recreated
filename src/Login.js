import React from 'react';
import {Container} from 'react-bootstrap'

// https://developer.spotify.com/documentation/web-api/
// Creating the UTL from the docs in the link above

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=853556b1fbc44f33b98fab9d95d8eca9&response_type=code&redirect_uri=https://musicapiapp.herokuapp.com&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login (){
    return (
    
        // Center the button

    <Container className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
        <a className="btn btn-success btn-lg" href={AUTH_URL}>Login</a>
        
    </Container>
    )
}
