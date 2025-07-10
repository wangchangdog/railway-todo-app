import { logout } from '@/store/auth'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    await dispatch(logout()).unwrap()
    navigate('/signin')
  }, [useDispatch])

  return {
    logout: handleLogout,
  }
}
