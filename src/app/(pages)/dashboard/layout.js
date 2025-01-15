import Navbar from '@/components/Navbar'
import React from 'react'

const layout = ({ children }) => {
    return (
        <>
            
                <Navbar />

                <div className='pt-10 my-10'>
                    {children}
                </div>
            {data.folowers && <div>{data.folowers}</div>}
        </>
    )
}

export default layout