import React from 'react'

const Loader = () => {
    return (
        <>
            <div className='w-fit flex gap-x-1 text-center mx-auto'>
                <div className="w-2 h-2  bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2  bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2  bg-white rounded-full animate-bounce"></div>
            </div>
        </>
    )
}

export default Loader