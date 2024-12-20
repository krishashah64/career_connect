import {createSlice} from "@reduxjs/toolkit";

const jobApplicantSlice = createSlice({
    name: "jobApplicant",
    initialState: {
        isFormVisible: false,
        formData: {
            fullName: '',
            email: '',
            phone: '',
            coverLetter: '',
           // resume: null},
        },
    },
    reducers: {
        setIsFormVisible: (state, action) => {
            state.isFormVisible = action.payload ;
        },

        setFormData: (state, action) => {

            state.formData = { ...state.formData, ...action.payload };
    //         const { fullName, email, phone, coverLetter } = action.payload;

    // // Only store the file metadata
    //         // const resumeMetadata = resume
    //         //     ? {
    //         //         name: resume.name,
    //         //         size: resume.size,
    //         //         type: resume.type,
    //         //     }
    //         //     : null;

    //         state.formData = {
    //             fullName,
    //             email,
    //             phone,
    //             coverLetter,
    //             // resume: resumeMetadata, // Store only metadata
    //         };

        }

    }

})

export const {setIsFormVisible, setFormData} = jobApplicantSlice.actions;
export default jobApplicantSlice.reducer;

   