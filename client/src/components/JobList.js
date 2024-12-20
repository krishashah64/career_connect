import React, { useState } from 'react'
import { useEffect } from 'react'
import { addJobs, setSelectedJob } from '../utils/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import JobCard from './JobCard';

const JobList = () => {

    const dispatch = useDispatch();

    const jobs = useSelector((store) => store.jobs.jobs);
    const jobSearchResults = useSelector(store => store.jobs.jobSearchResults || []);
    console.log(jobs[0]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const jobsPerPage = 5;

    // console.log("-----------------", JobCard);


    // const [jobs, setJobs] = useState([]);

    // useEffect(() => {
    //     fetchJobData(currentPage, jobsPerPage);
    // }, [currentPage]);

    // useEffect(() => {
    //     fetchJobData();
    // }, []);

    useEffect(() => {
        if (jobSearchResults.length === 0 && jobs.length === 0) {
            fetchJobData();
        }
    }, [jobSearchResults, jobs]);

    useEffect(() => {
        const totalResults = jobSearchResults.length > 0 ? jobSearchResults.length : jobs.length;
        setTotalPages(Math.ceil(totalResults / jobsPerPage));
    }, [jobSearchResults, jobs]);

    // }, [jobSearchResults, jobs]);


    useEffect(() => {
        // Check if jobSearchResults has jobs, else fallback to jobs
        const selectedJob = jobSearchResults.length > 0 ? jobSearchResults[0] : jobs[0];
        
        if (selectedJob) {
            dispatch(setSelectedJob(selectedJob)); // Set the first job from the respective list as selected
        }
    }, [jobs, jobSearchResults, dispatch]);


    // const fetchJobData = async () => {
    // //     // const jobData = await fetch(`https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=c9ddfe98&app_key=2397935e97b5daaeb42d37175482badb&results_per_page=${jobsPerPage}`);
    // //     // const jobData = await fetch('http://localhost:5000/jobs');
    // //     const jsonJobData = await jobData.json();
    // //      console.log(jsonJobData.results);
    // //    // const totalResults = jobSearchResults.length > 0 ? jobSearchResults.length : jsonJobData.results.length
    // //         // const totalResults = jsonJobData.count || jsonJobData.total_results || 0;
    // //     //setTotalPages(Math.ceil(totalResults / jobsPerPage));

    // //         // setJobs(jsdonJobData.results)
    // //     dispatch(addJobs(jsonJobData.results || []));
    //     try {
    //         const jobData = await fetch('http://localhost:5000/jobs');
    //         if (!jobData.ok) {
    //             throw new Error('Failed to fetch jobs');
    //         }
    //         const jsonJobData = await jobData.json();
    //         setTotalPages(Math.ceil(jsonJobData.results.length / jobsPerPage));
    //         dispatch(addJobs(jsonJobData.results || []));
    //     } catch (error) {
    //         console.error('Error fetching jobs:', error);
    //     }
    // }

    const fetchJobData = async () => {
        try {
            const response = await fetch('http://localhost:5000/jobs');
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const jsonJobData = await response.json();
            console.log('Fetched Job Data:', jsonJobData);
            if (Array.isArray(jsonJobData)) {
                setTotalPages(Math.ceil(jsonJobData.length / jobsPerPage));
                dispatch(addJobs(jsonJobData));  // Directly use the array
            } else {
                console.error('Unexpected response structure:', jsonJobData);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleApply = () => {
        console.log("Applied!");
    }

    const handleJobClick = (job) => {
        dispatch(setSelectedJob(job));
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const displayedJobs = (jobSearchResults.length > 0 ? jobSearchResults : jobs).slice(
        (currentPage - 1) * jobsPerPage,
        currentPage * jobsPerPage
    );

  return (
    <div className='w-2/5'>
        {displayedJobs?.map((job) => (
            <div className="border-gray-200 border-2 m-2  rounded-md p-5 group hover:cursor-pointer" onClick={() => handleJobClick(job)} key={job.id}>
            
            <p className="text-left text-lg font-semibold group-hover:underline">{job.title}</p>
            <p className="text-left text-sm">{job.company_name}</p>
            <p className="text-left text-sm">{job.location}</p>
            <p className="text-left text-sm">{job.description}</p>
            
        </div>
    ))}

<div className="flex justify-between mt-4">
                <button
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <p className="self-center">
                    Page {currentPage} of {totalPages}
                </p>

                <button
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
                </div>
    </div>
    
  )
}

export default JobList