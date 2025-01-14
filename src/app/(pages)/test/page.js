'use client'

import React from 'react'
import { useForm } from 'react-hook-form'

const page = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();


  const handledata = (data) => {
    console.log(data);
    reset();
  }

  return (
    <>
      <div className='container-1'>
        <form onSubmit={handleSubmit(handledata)}>
          <div>
            <input
              type='text'

              {...register("name", {
                required: 'name is required'
              })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <button>submit</button>
        </form>
      </div>
    </>
  )
}

export default page