import React,{ useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
SEARCH_USERS,
SET_LOADING,
CLEAR_USERS,
GET_USER
} from '../types';

let githubClientId;
let githubClientSecret;
if (process.env.NODE_ENV !== 'production') {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
}
else{
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = props => {
    const initialState = {
        users: [],
        user: {},
        laoding: false,
    };

    const [state, dispatch] = useReducer(GithubReducer, initialState);
    //search users
     //search github users
   const searchUSers = async text => {
    setLoading ();
    
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${
        githubClientId
      }&client_secret=${githubClientSecret}`);
     
      dispatch(
          {
              type: SEARCH_USERS,
              payload: res.data.items
          }
      )
      
   };

    //get user
    const getUser = async (username) => {
        setLoading();
         
         const res = await axios.get(
           `https://api.github.com/users/${username}?&client_id=${
            githubClientId
           }&client_secret=${githubClientSecret}`);
           dispatch({
               type: GET_USER,
             payload: res.data
           })
        };

    //clear users
    const clearUsers = () =>  dispatch({ type: CLEAR_USERS })
    
    //set loading
    const setLoading = () => dispatch({ type: SET_LOADING });

    return (
    <GithubContext.Provider
        value = {{
            users: state.users,
            user: state.user,
            loading: state.loading,
            searchUSers,
            clearUsers,
            getUser
        }}>
            {props.children}
    </GithubContext.Provider>);
}
export default GithubState