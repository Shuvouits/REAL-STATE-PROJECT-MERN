import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })

  }

  const handleSubmit = async (e) => {

    try {

      e.preventDefault();
      setLoading(true)
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();


      if (res.status === 401) {
        setError(data.message)
        setLoading(false)
      }

      if (res.status === 200) {
        
        dispatch({ type: "LOGIN", payload: data });
        Cookies.set("user", JSON.stringify(data));
        setLoading(false)
        navigate('/')
      }



    } catch (error) {

      if (res.status === 500) {
        setError("Internal Server Problem")

      }
      setLoading(false)


    }

  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign In'}</button>

      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to="/sign-up">
          <span className='text-blue-700'>Sign Up</span>
        </Link>

      </div>
      <p className='text-red-700 font-bold'>{error}</p>
    </div>
  )
}
