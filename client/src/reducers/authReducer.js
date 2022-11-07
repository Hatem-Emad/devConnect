import { 
    REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL, 
    LOGOUT,
    ACCOUNT_DELETED
} from '../actions/types'

const initState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,      //we will set it to false when we get data from server
    user: null
}

const authReducer = (state = initState, action) => {
    const { type, payload } = action

    switch( type ){
        case USER_LOADED: 
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return{
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case ACCOUNT_DELETED:
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            return{
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false      //it failed, but still done loading
            }

        default:
            return state;
    }
}

export default authReducer;