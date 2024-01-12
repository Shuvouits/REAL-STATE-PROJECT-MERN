import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from '@firebase/auth'
import { app } from '../firebase'
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom"

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const handleGoogleClick = async() => {
        try{
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)

            console.log(result)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            })

            const userData = await res.json();

            dispatch({ type: "GOOGLEAUTH", payload: userData });
            Cookies.set("user", JSON.stringify(userData));
            navigate('/')

        }catch(error){
            console.log("error google auth")
        }
    }
  return (
    <button type='submit' onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue With Google</button>
  )
}
