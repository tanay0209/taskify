import Header from '@/components/Header'
import React from 'react'

function layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className='min-h-screen'>
            <Header />
            <div className='h-[calc(100vh-100px)]'>
                {children}
            </div>
        </div>
    )
}

export default layout
