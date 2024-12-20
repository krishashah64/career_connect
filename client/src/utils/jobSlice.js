import {createSlice} from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "jobs",
    initialState: {
        jobs: [], 
        selectedJob: null,
        jobSearchResults: [],
    },
    reducers: {

        addJobs: (state, action) => {
            state.jobs = action.payload;
        },
        setSelectedJob: (state, action) => {
            state.selectedJob = action.payload;
        },
        searchedJobs: (state, action) => {
            state.jobSearchResults = action.payload;
        }
        

    }
});

export const {addJobs, setSelectedJob, searchedJobs} = jobSlice.actions;
export default jobSlice.reducer;
