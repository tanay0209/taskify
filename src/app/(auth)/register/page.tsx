import { Register } from '@/components/RegisterForm'
import React from 'react'

function page() {
    return (
        <div className='w-full h-dvh flex items-center justify-center'>
            <div className='shadow-md p-6 bg-white rounded-sm space-y-4 max-w-md w-full'>
                <h2 className='font-semibold text-3xl text-center'>Register</h2>
                <Register />
            </div>
        </div>
    )
}

export default page
