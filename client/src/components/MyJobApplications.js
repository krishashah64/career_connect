import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { displayJobApplications } from '../utils/userSlice';

const MyJobApplications = () => {

    const loggedInUser = useSelector(store => store.users.loggedInUser);
    const [myjobs, setMyJobs] = useState([]);

  useEffect(() => {
    fetchData();
  }, [loggedInUser]);

  const fetchData = async () => {
    try{
        const response = await fetch( `http://localhost:5000/myjobapplications?user_id=${loggedInUser.id}`, 
            {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },              
            }
        );
        const myjobapplications = await response.json();
        // dispatchEvent(displayJobApplications(MyJobApplications))
        setMyJobs(myjobapplications);
        console.log("---------my job applications--------------", myjobapplications);
    } catch(error) {
        console.log(error);
    }
  }

  return (
    // <div>
    //   <h2 className='font-bold text-2xl m-2'>My Jobs</h2>
    //   <div className='flex flex-col justify-center items-center '>
      
    //     {/* <div className=""> */}
    //     {myjobs.map((job) => (
    //       <div className='p-4 m-2 w-96 px-48 border-2 border-gray-200 rounded-md'>
    //         <div className='font-bold  whitespace-normal'>{job.title}</div>
    //         <div className=' whitespace-normal'>{job.company_name}</div>
    //         <div className=' whitespace-normal'>{job.location}</div>
    //         <div className='text-gray-500  whitespace-normal'>Applied on {new Date(job.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
    //       </div>
    //     ))}
    //     {/* </div> */}
        
    //   </div>
    // </div>

    <div className='flex flex-col justify-center items-center'>
      <h2 className='font-bold text-2xl m-2'>My Jobs</h2>
      <div className="w-full max-w-xl">
        {myjobs.map((job) => (
          <div className='p-4 m-2 border-2 border-gray-200 rounded-md shadow-md'>
            <div className='font-bold text-lg mb-1 whitespace-normal'>{job.title}</div>
            <div className='whitespace-normal'>{job.company_name}</div>
            <div className='whitespace-normal'>{job.location}</div>
            <div className='text-gray-500 whitespace-normal'>
              Applied on {new Date(job.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
    
  )
}

export default MyJobApplications;