'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const page = () => {
  const { data: session } = useSession();
  return (
    <>
      <div className='container-1' >
        <h1>home page{session?.user?.name}</h1>
        <button className='btn my-2'>
          <Link href={'/api/auth/signin'}>
            Login
          </Link>
        </button>

      </div>
    </>
  )
}

export default page