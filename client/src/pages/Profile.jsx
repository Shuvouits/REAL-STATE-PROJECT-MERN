import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'


export default function Profile() {
  const { user } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false)
  //const [formData, setFormData] = useState({});

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    // Set initial values for username and email when the component mounts
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '',
    });
  }, [user]);


  /* firebase Storage
  allow read;
  allow write : if
  request.resource.size < 2 * 1024 * 1024 && 
  request.resource.contentType.matches('image/.*') 
  */
  


  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
    }, (error) => {
      setFileUploadError(true);

    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({ ...formData, avatar: downloadURL }))
    }
    );

  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    console.log(formData)
    try {
      const res = await fetch(`/api/update/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 200) {
        dispatch({ type: "UPDATE", payload: data });
        Cookies.set("user", JSON.stringify(data));
        setLoading(false);
        setSuccess(data.message);
        //navigate('/')
      }

    } catch (error) {
      // Handle error appropriately
      if (error.status === 500) { // Fixed here
        setError("Internal Server Problem");
      }
      setLoading(false)
    }
  };

  const handleDeleteUser = async(e)=>{
    try{

      const res = await fetch(`/api/delete/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        }
      });

      const data = await res.json();

      if (res.status === 200) {
        dispatch({ type: "DELETE", payload: null });
        Cookies.set("user", null);
        setLoading(false);
        setSuccess(data.message);
        navigate('/sign-in')
      }


    }catch(error){

      if (error.status === 500) { 
        setError("Internal Server Problem");
      }
      setLoading(false)

    }


  }




  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
        <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || user.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {
            fileUploadError ? (
              <span className='text-red-700'>Error Image Upload (image must be less than 2 mb)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{` Uploading ${filePerc}% `}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700'>Image Successfully Uploaded!</span>
            ) : (
              ''
            )
          }

        </p>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} value={formData.username} />
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} value={formData.email}  />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}  />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>

      </div>

      <div className='text-center'>
        <p className='text-red-700 font-bold'>{error}</p>
        <p className='text-green-700 font-bold'>{success}</p>
      </div>

    </div>
  )
}
