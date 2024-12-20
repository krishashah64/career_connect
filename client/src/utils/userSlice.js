import {createSlice} from "@reduxjs/toolkit";
import MyJobApplications from "../components/MyJobApplications";

const userSlice = createSlice({
    name: "users",
    initialState: {
        loggedIn: false,
        signUpClicked: false,
        loggedInUser: {}, 
        myJobApplications: {}
    },
    reducers: {
        userLoggedIn: (state, action) => {
            state.loggedIn = true;
        },

        logOut: (state, action) => {
            state.loggedIn = false;
            state.loggedInUser = {};
        },

        setSignUpClicked: (state, action) => {
            state.signUpClicked = action.payload;
        },
        addLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        displayJobApplications: (state, action) => {
            state.myJobApplications = action.payload;
        }
    }

})

export const {userLoggedIn, logOut, setSignUpClicked, addLoggedInUser, displayJobApplications} = userSlice.actions;
export default userSlice.reducer;

   