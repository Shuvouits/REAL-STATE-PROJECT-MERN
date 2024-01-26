import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react';


export default function Header() {
    const { user } = useSelector((state) => ({ ...state }));
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
          setSearchTerm(searchTermFromUrl);
        }
      }, [location.search]);



    return (
        <div>
            <header className='bg-slate-200 shadow-md'>
                <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <Link to={'/'}>
                            <span className='text-slate-500'>Real</span>
                            <span className='text-slate-700'>Estate</span>
                        </Link>

                    </h1>
                    <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                        <input type='text' onChange={(e)=> setSearchTerm(e.target.value)} placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                        <FaSearch className='text-slate-600' />

                    </form>
                    <ul className='flex gap-4'>
                        <Link to={'/'}>
                            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                        </Link>
                        <Link to={"/about"}>
                            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                        </Link>
                        <Link to={"/profile"}>
                            {user ? (
                                <img className='rounded-full h-7 w-7 object-cover' src={user.avatar} alt='profile' />

                            ) : (
                                <li className='hidden sm:inline text-slate-700 hover:underline'>Sign In</li>

                            )}
                            
                        </Link>


                    </ul>
                </div>

            </header>
        </div>
    )
}
