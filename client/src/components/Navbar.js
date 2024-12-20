import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Body from "./Body";
import Login from "./Login";
import ContactUs from "./ContactUs";
import Mentorship from "./Mentorship";
import Profile from "./Profile";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../utils/userSlice";
import {useState} from "react";
import MyJobApplications from "./MyJobApplications";
const Navbar = () => {


    const dispatch = useDispatch();

    const loggedIn = useSelector(store => store.users.loggedIn);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logOut());
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // const appRouter = createBrowserRouter([
    //     {
    //         path: "/",
    //         element: <Body />
    //     },
    //     {
    //         path: "/contact",
    //         element: <ContactUs />
    //     },
    //     {
    //         path: "/mentorship",
    //         element: <Mentorship />
    //     },
    //     {
    //         path: "/login",
    //         element: <Login />
    //     },
    // ]);

    return(
        // <div className="flex text-lg border-b-2 p-3 justify-between">
        //     {/* <a className="text-blue-900 font-bold text-xl" href="/">CareerConnect</a>
        //     <ul className="flex px-10" >
        //         <li className="px-5">Home</li>
        //         <li className="px-5">Contact Us</li>
        //         <li className="px-5">Mentorship</li>
        //     </ul>
        //      */}
        //     <RouterProvider router={appRouter} />
        // </div>
        <BrowserRouter>
            <div className="flex text-lg border-b-2 p-3 justify-between w-screen">
                <Link className="text-blue-900 font-bold text-xl" to="/">CareerConnect</Link>
                {/* <ul className="flex px-10">
                    <li className="px-5 hover:bg-slate-200"><Link to="/">Home</Link></li>
                    <li className="px-5 hover:bg-slate-200"><Link to="/contact">Contact Us</Link></li>
                    <li className="px-5 hover:bg-slate-200"><Link to="/mentorship">Mentorship</Link></li>
                    {!loggedIn 
                        ? 
                        <li className="px-5"><Link to="/login">Login</Link></li> 
                        : 
                        <li className="px-5"><Link to="/login" onClick={handleLogout}>Logout</Link></li>
                    }
                </ul> */}
                <ul className="flex px-10">
                    <li className="px-5 hover:bg-slate-200"><Link to="/">Home</Link></li>
                    <li className="px-5 hover:bg-slate-200"><Link to="/contact">Contact Us</Link></li>
                    <li className="px-5 hover:bg-slate-200"><Link to="/mentorship">Mentorship</Link></li>
                    {!loggedIn ? (
                        <li className="px-5"><Link to="/login">Login</Link></li>
                    ) : (
                        <li className="relative px-5">
                            <button 
                                className="hover:bg-slate-200"
                                onClick={toggleDropdown}
                            >
                                Account
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
                                    <Link 
                                        to="/profile" 
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                    <Link 
                                        to="/myjobapplications" 
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        My jobs
                                    </Link>
                                    <button 
                                        onClick={handleLogout} 
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    )}
                </ul>
            </div>
            <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/mentorship" element={<Mentorship />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/myjobapplications" element={<MyJobApplications />} />
            </Routes>
        </BrowserRouter>
        // </div>
    
    )
}

export default Navbar;