import { configureStore } from '@reduxjs/toolkit'
import authReducer from './redux/authslice'

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
})