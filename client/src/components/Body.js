import React, { useState } from 'react'
import JobCard from './JobCard'
import JobList from './JobList'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedJob } from '../utils/jobSlice'
import SearchJob from './SearchJob'
import Navbar from './Navbar'

const Body = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((store) => store.jobs);
  const selectedJob = useSelector(store => store.jobs.selectedJob);
  return (
    <div>

      <div className='flex flex-col justify-center items-center'>
        
        <SearchJob />
      
        <div  className='flex justify-center w-4/5'>
            <JobList />
            {selectedJob && <JobCard job={selectedJob} />}
            
        </div>
      </div>
    </div>
   
    
  )

// return (
//     <div className='h-screen flex flex-col justify-center items-center'>
//       {/* Search Box */}
//       <div className='border-2 w-1/2 m-3 text-left flex justify-between rounded-md items-center p-4'>
//         <input type='text' placeholder='Enter job title here..' className='m-2 w-1/2' />
//         <input type='text' placeholder='Location..' className='border-l-2 px-3 m-2 w-1/2' />
//         <button className="bg-blue-600 text-white p-2 m-2 rounded-md w-1/6" type='submit'>Search</button>
//       </div>
  
//       {/* Job List and Job Card */}
//       <div className='flex justify-center'>
//         <JobList />
//         <JobCard />
//       </div>
//     </div>
//   );
  
}

export default Body