'use client';

import AddProduct from '@/components/AddProduct';
import { deleteItem, fetchProduct } from '@/services/Product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";


const page = () => {
    const { data: session } = useSession();
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setSearch] = useState(null);
    const [products, setProducts] = useState('all-products')
    // query client key
    const queryClient = useQueryClient();




    const { data, isLoading, isError } = useQuery({
        queryKey: ['product', { search, products }],
        queryFn: fetchProduct,
        staleTime: 10 * 60 * 1000
    })


    const Toggle = () => {
        setShow(!show);
    };




    if (isLoading) {
        return <h1>Loading...</h1>
    }

    if (isError) {
        return <h1>Error...</h1>
    }
    return (

        <>


            <div className='container-1'>
                <h1>Dashboard{session?.user?.name}</h1>
                <div className={`absolute top-0 left-0 right-0 bottom-0 z-50 ${show ? '' : 'hidden'}`}>
                    {show ? <AddProduct /> : ''}
                    {show ? <IoCloseSharp className='absolute top-3 right-3 text-3xl cursor-pointer' onClick={Toggle} /> : ''}
                </div>


                <div className='flex relative'>
                    <input
                        id="search"
                        name="search"
                        className="block w-full pl-10 pr-3 py-2 dark:text-white border border-gray-200 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Search testimonials by name, email, or keywords"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (e.target.value == '') {
                                setSearch(null)
                            }
                        }}
                    />
                    <div className='absolute top-[50%] left-2 translate-y-[-50%] cursor-pointer' onClick={() => { setSearch(searchTerm) }}>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                </div>


                <div className="mb-4 flex items-center gap-x-2 my-2">
                    <label>Product :</label>
                    <select
                        className="bg-[#5d5dff] text-white rounded p-1"
                        onChange={(e) => setProducts(e.target.value)}
                    >
                        <option value="all-products">All Public Product</option>
                        <option value="my-products">My Product</option>
                    </select>
                </div>

                <div className='grid  grid-flow-row grid-cols-3 gap-5 my-3'>

                    {
                        data?.map((item, index) => (
                            <div
                                key={index}
                                className="w-full bg-white shadow-lg overflow-hidden rounded-lg duration-300 transform hover:scale-105 hover:shadow-2xl">
                                <Link href={"#"} className="flex flex-col h-full justify-between">
                                    {/* Image Section */}
                                    <div className="img-wrapper flex justify-center items-center bg-gray-100 w-full h-48 overflow-hidden">
                                        <Image
                                            alt={item?.name}
                                            src={item?.image || 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg'}
                                            fill
                                            style={{
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        {/* Content Section */}
                                        <div className="w-full px-5 py-4">
                                            {/* Title and Brand */}
                                            <div className="mb-3">
                                                <h3 className="text-lg font-bold text-gray-800 mt-1 truncate">
                                                    {item?.name || "Product Name"}
                                                </h3>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xl font-semibold text-green-600">
                                                    ${item?.price || "0.00"}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Making Time : {item?.time?.hours || 0}h {item?.time?.minutes || 0}m
                                                </span>
                                            </div>
                                        </div>


                                    </div>
                                </Link>
                            </div>
                        ))
                    }

                </div>
            </div>
        </>
    );
};

export default page;
