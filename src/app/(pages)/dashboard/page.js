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
    const [isModalOpen, setIsModalOpen] = useState(null);
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

    const toggleModal = (item = null) => {
        setIsModalOpen(item);
        document.body.classList.toggle('modal-open');
    }




    const { mutate: deleteMutate } = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            // Remove the deleted product from cache
            setIsModalOpen(null);
            document.body.classList.toggle('modal-open');
            queryClient.invalidateQueries(['product']);
        },
        onError: (error) => {
            console.error('Delete failed:', error.message);
        },
    });




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
                <button className='btn' onClick={Toggle}>Add Product</button>
                <button className='btn my-2' onClick={() => signOut()}>Sign out</button>
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

                <div className='grid grid-flow-row grid-cols-3 gap-5 my-3'>

                    {
                        data?.map((item, index) => (
                            <div
                                key={index}
                                className="w-full bg-white shadow-lg overflow-hidden rounded-lg duration-300 transform hover:scale-105 hover:shadow-2xl">
                                <Link href={"#"} className="flex flex-col h-full justify-between">
                                    {/* Image Section */}
                                    <div className="img-wrapper flex justify-center items-center bg-gray-100 w-full h-48 overflow-hidden">
                                        <Image
                                            alt={item?.name || "Product Image"}
                                            src={item?.image || "/placeholder.png"}
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
                                                    {item?.time?.hours || 0}h {item?.time?.minutes || 0}m
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-between px-5 py-3 bg-gray-50 border-t">
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => toggleModal(item._id)}
                                                className="text-red-500 hover:text-red-600 flex items-center gap-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                                <span>Delete</span>
                                            </button>

                                            {/* Update Button */}
                                            <button
                                                onClick={() => updateItem(item._id)}
                                                className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M11 17l-4-4m0 0l4-4m-4 4h16"
                                                    />
                                                </svg>
                                                <span>Update</span>
                                            </button>
                                        </div>

                                    </div>
                                </Link>
                            </div>
                        ))
                    }

                </div>

                <div className={`modal-center ${isModalOpen == null ? 'hidden' : ''}`}>
                    <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        <button onClick={() => toggleModal()} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                        <p className="overflow-hidden whitespace-nowrap text-ellipsis mb-4 text-gray-500 dark:text-gray-300">
                            Once confirmed, this testimonial will be permanently removed.
                        </p>
                        <div className="flex justify-center items-stretch space-x-4">
                            <button onClick={() => toggleModal()} type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                No, cancel
                            </button>
                            <button onClick={() => deleteMutate(isModalOpen)} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                                Yes, I am sure
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default page;
