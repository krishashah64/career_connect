import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react';
import { searchedJobs } from '../utils/jobSlice';


const SearchJob = () => {

    const jobs = useSelector(store => store.jobs);
    console.log(jobs);
    const searchText = useRef(null);
    const locationRef = useRef(null);
    const dispatch = useDispatch();

    // const handleJobSearch = async () => {
    //     // const data = await fetch(`http://localhost:5000/search-jobs`, { searchText.current.value });
    //     // const jsonData = await data.json();
    //     // // console.log(jsonData.results);
    //     // dispatch(searchedJobs(jsonData.results));

    //     const searchQuery = searchText.current.value; // Get the search text
        
    //     const response = await fetch('http://localhost:5000/search-jobs', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ searchQuery: searchQuery, location: locationRef.current.value })
    //     }); // Send search query in the body

    //     const jsonData = await response.json();
    //     console.log("JsonData--------------------", jsonData);
    //     // Dispatch the search results to Redux
    //     if (jsonData.results) {
    //         // Dispatch only if there are results
    //         dispatch(searchedJobs(jsonData.results));
    //     }
    //     // dispatch(searchedJobs(jsonData.results));
        
    // }

    const handleJobSearch = async () => {
        try {
            const searchQuery = searchText.current.value;
            const response = await fetch('http://localhost:5000/search-jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchQuery: searchQuery, location: locationRef.current.value })
            });

            // console.log("response--------------------", response.json())
    
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
    
            const jsonData = await response.json();
            console.log("JsonData:", jsonData);
    
            // Dispatch to Redux
            if (jsonData && jsonData.length > 0) {            
                dispatch(searchedJobs(jsonData));
            }
    
        } catch (error) {
            console.error("Error in job search:", error);
        }
    };
    

    

  return (
    <div className='border-2 w-1/2 m-3 text-left flex justify-between rounded-md items-center'> 
        <span className='pl-2'>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className="size-5"
            >
                <path 
                    fillRule="evenodd" 
                    d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" 
                    clipRule="evenodd" 
                />
            </svg>
        </span>

        <input 
            type='text' 
            placeholder='Enter job title here..' 
            className='m-2 w-1/2'
            ref={searchText}
        >
        </input>
                      
        <span className='border-l-2 pl-2'>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className="size-5"
            >
                <path 
                    fillRule="evenodd" 
                    d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" 
                    clipRule="evenodd" 
                />
            </svg>
        </span>

        <input 
            type='text' 
            placeholder='Location..' 
            className=' m-2 w-1/2'
            ref={locationRef}>
        </input>

        <button 
            className="bg-blue-600 text-white p-2 m-2 rounded-md w-1/6" 
            type='submit' 
            onClick={handleJobSearch}>
            Search
        </button>
        
    </div>
  )
}

export default SearchJob;