"use client"

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { login } from '../../redux/authslice'
import { useRouter } from 'next/navigation'

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
})

const Login = () => {
const [view, setView] = useState(false)
const [errorMsg, setErrorMsg] = useState('')
const dispatch = useDispatch()

const router = useRouter()

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    const { email, password } = values
    setErrorMsg('')
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, { email, password })

    dispatch(login(res.data))
    router.push('/')
   console.log(res.data)
  } catch (error) {
    setErrorMsg(error.response?.data?.message || 'Login failed')
    console.log(error)
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              
              {/* Email */}
              <div className="flex flex-col">
                <Field
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black transition"
                />
                <ErrorMessage name="email" component="span" className="text-red-500 text-xs mt-1" />
              </div>

              
              {/* Password */}
<div className="flex flex-col">
  <div className="relative">
    
    <Field
      name="password"
      type={view ? "text" : "password"}
      placeholder="Password"
      className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-black transition"
    />

    <button
      type="button"
      onClick={() => setView(!view)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
    >
      {view ? <VisibilityIcon /> : <VisibilityOffIcon />}
    </button>

  </div>

  <ErrorMessage
    name="password"
    component="span"
    className="text-red-500 text-xs mt-1"
  />
</div>

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
            
          )}
        </Formik>
        {errorMsg && (
  <p className="text-red-500 text-sm text-center">{errorMsg}</p>
)}

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account? <span className="text-black font-medium cursor-pointer hover:underline">Sign up</span>
        </p>

      </div>
    </div>
  )
}

export default Login