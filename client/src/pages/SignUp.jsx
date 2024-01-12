import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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
      const res = await fetch('/api/signup', {
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
        setLoading(false)
        navigate('/sign-in')
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
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign Up'}</button>

      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-700'>Sign In</span>
        </Link>

      </div>
      <p className='text-red-700 font-bold'>{error}</p>
    </div>
  )
}
