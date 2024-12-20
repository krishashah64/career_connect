import {configureStore} from "@reduxjs/toolkit";
import jobReducer from "./jobSlice";
import userReducer from "./userSlice"
import jobApplicantReducer from "./jobApplicantSlice"

const appStore = configureStore({
    reducer: {
        jobs: jobReducer,
        users: userReducer,
        jobApplicant: jobApplicantReducer,
    }
    
});

export default appStore;