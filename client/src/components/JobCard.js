import { useSelector, useDispatch } from "react-redux";
import { setIsFormVisible, setFormData } from '../utils/jobApplicantSlice';
import { displayJobApplications, userLoggedIn } from "../utils/userSlice";

const JobCard = ({job}) => {

    const isFormVisible = useSelector((Store) => Store.jobApplicant.isFormVisible);
    const formData = useSelector(Store => Store.jobApplicant.formData);
    const loggedInUser = useSelector(store => store.users.loggedInUser);
    console.log(isFormVisible);
    const dispatch = useDispatch();

   // console.log({job});

    const handleApply = () => {
        console.log("Applied!");
        dispatch(setIsFormVisible(true));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('job_id', job.id); // Assuming job.id is the job's unique identifier
        data.append('user_id',loggedInUser.id); 
        data.append('full_name', formData.fullName);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('cover_letter', formData.coverLetter);
        if (formData.resume) {
            data.append('resume', formData.resume);
        }
        console.log('Form data before submit:', formData);
        // dispatch(setFormData(data));
        // dispatch(setIsFormVisible(false));

        // console.log(data);

        try{
            const response = await fetch("http://localhost:5000/apply", {
                method: "POST",
                body: data
            });
            if (response.ok){
                alert("Application Submitted Successfully!");
                dispatch(setIsFormVisible(false));
            }
            else{
                alert("Failed!");
            }
        }
        catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        dispatch(setFormData({ resume: file.name }));
    }

    return(
        <div className="border-gray-200 border-2 m-2 w-2/5 rounded-md p-5 group hover:cursor-pointer h-screen sticky top-0">
            {/* <h1>Jobs</h1> */}
            <p className="text-left text-lg font-semibold group-hover:underline">{job.title}</p>
            <p className="text-left text-sm">{job.company_name}</p>
            <p className="text-left text-sm">{job.location}</p>
            {/* <p className="text-left text-sm">{job.description}</p> */}
            <div className="pt-2">
                    <button type="submit" className="bg-blue-600 px-6 py-2 text-white font-semibold rounded-md block" onClick={handleApply}>Apply</button>
                </div>
            <p className="text-left text-sm py-2">{job.description}</p>             
                
            {isFormVisible && (
                <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-5 rounded-md shadow-md w-1/2">
                    <h2 className="text-lg font-bold mb-4">Apply for {job.title}</h2>
                    <form onSubmit={handleSubmit} >
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                           value={formData.fullName}
                            onChange={handleChange}
                            className="block w-full p-2 border rounded mb-2"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                           value={formData.email}
                            onChange={handleChange}
                            className="block w-full p-2 border rounded mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                           value={formData.phone}
                            onChange={handleChange}
                            className="block w-full p-2 border rounded mb-2"
                            required
                        />
                        <textarea
                            name="coverLetter"
                            placeholder="Cover Letter"
                           value={formData.coverLetter}
                            onChange={handleChange}
                            className="block w-full p-2 border rounded mb-2"
                            required
                        />
                        <input
                            type="file"
                                onChange={handleFileChange}
                            className="block w-full p-2 border rounded mb-2"
                            required
                        />
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
                                onClick={() => dispatch(setIsFormVisible(false))}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </div>
    );
}

export default JobCard;