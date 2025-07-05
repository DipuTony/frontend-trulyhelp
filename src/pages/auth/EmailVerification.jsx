import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmail } from '../../store/slices/authSlice'
import LoaderType1 from '../../components/common/LoaderType1'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const EmailVerification = () => {
    const { token } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error } = useSelector((state) => state.auth)
    const [success, setSuccess] = useState(false)
    const [counter, setCounter] = useState(3)
    const [failed, setFailed] = useState(false)
    const [failCounter, setFailCounter] = useState(5)

    useEffect(() => {
        const verify = async () => {
            try {
                const resultAction = await dispatch(verifyEmail(token))
                if (verifyEmail.fulfilled.match(resultAction)) {
                    setSuccess(true)
                    showSuccessToast(resultAction.payload?.message || 'Email verified successfully')
                } else {
                    setFailed(true)
                    showErrorToast(resultAction.payload || 'Failed to verify email')
                }
            } catch (err) {
                setFailed(true)
                showErrorToast('Failed to verify email')
            }
        }
        verify()
    }, [dispatch, token])

    useEffect(() => {
        let timer
        if (success && counter > 0) {
            timer = setTimeout(() => setCounter((c) => c - 1), 1000)
        } else if (success && counter === 0) {
            navigate('/login')
        }
        return () => clearTimeout(timer)
    }, [success, counter, navigate])

    useEffect(() => {
        let timer
        if (failed && failCounter > 0) {
            timer = setTimeout(() => setFailCounter((c) => c - 1), 1000)
        } else if (failed && failCounter === 0) {
            navigate('/login')
        }
        return () => clearTimeout(timer)
    }, [failed, failCounter, navigate])

    if (loading && !success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <LoaderType1 />
                <p className="mt-4 text-lg font-semibold text-indigo-700">Verifying...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {success ? (
                <>
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded mb-4 text-center">
                        Email verified successfully!<br />
                        Redirecting to login in {counter}...
                    </div>
                    <button
                        className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </button>
                </>
            ) : failed ? (
                <>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-4 text-center">
                        {error || 'Something went wrong.'}<br />
                        Redirecting to login in {failCounter}...
                    </div>
                    <button
                        className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </button>
                </>
            ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded text-center">
                    {error || 'Something went wrong.'}
                </div>
            )}
        </div>
    )
}

export default EmailVerification