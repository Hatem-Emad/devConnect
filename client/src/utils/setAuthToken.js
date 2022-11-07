//It is gonna be a funtion that takes a token, if the token is there it's gonna add to the headers. If not, it will delete it

import axios from 'axios';

const setAuthToken = token => {
    if(token){
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken;