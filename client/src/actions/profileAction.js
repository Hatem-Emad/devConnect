import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { setAlert } from "./alertAction";
import { 
    ACCOUNT_DELETED, 
    CLEAR_PROFILE, 
    GET_PROFILE, 
    GET_PROFILES, 
    PROFILE_ERROR 
} from "./types";

//Get current user profile
export const getCurrentProfile = () => async dispatch => {
    dispatch({type: CLEAR_PROFILE});

    try {
        const res = await axios.get('/api/profile/me/');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        });
    }
};

//Get profile by user ID
export const getProfileById = userId => async dispatch => {

    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        });
    }
};

//Get all profiles
export const getProfiles = () => async dispatch => {
    try {
        const res  = await axios.get('/api/profile');

        dispatch({
            type:GET_PROFILES,
            payload: res.data
        })
    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        });
    }
}

//Create or update profile
export const createProfile = (formData, edit ) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/profile', formData, config)

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

        //Redirect in action can't be by navigate, so it should be history
        
    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        });
    }
}

//Delete account & profile
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure? This can NOT be undone')){
        try {
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            await axios.delete('/api/users');
            dispatch({type: CLEAR_PROFILE});
            dispatch({type: ACCOUNT_DELETED});
           
            await dispatch(setAlert('Your account has been permanantly deleted', 'success'))
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg: error.response.statusText, status: error.response.status}
            })
        }
    }
}