'use client';

import Loader from '@/components/Loader';
import { uploadConvertImage } from '@/services/cloudinaryUrl';
import { sendProduct } from '@/services/Product';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';


const AddProduct = () => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    // For dynamic ingredients
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const { mutate } = useMutation({
        mutationFn: sendProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['product']);
            setLoading(false);
            console.log('complete');
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        const time = {
            hours: data.hours ? parseInt(data.hours) : 0, // Convert hours to number, default 0
            minutes: data.minutes ? parseInt(data.minutes) : 0, // Convert minutes to number, default 0
        };

        // Step 2: Add 'time' object to the 'data' object
        data.time = time;

        console.log('object', data);
        // Handle image upload
        if (data.image) {
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(data.image[0]);
            });
            data.image = await uploadConvertImage(base64);
        }

        mutate(data);
        reset();
    };

    return (
        <div className="absolute top-0 right-0 left-0 bottom-0 w-full h-full bg-blue-200 min-h-screen flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 absolute top-1/2 transform -translate-y-1/2">
                <h2 className="text-center text-blue-400 font-bold text-2xl uppercase mb-10">Fill out form</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Food Name Field */}
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 font-bold text-gray-600">Food Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter Food Name"
                            className="border border-gray-300 shadow p-3 w-full rounded"
                            {...register('name', { required: 'Food Name is required' })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Food Price Field */}
                    <div className="mb-5">
                        <label htmlFor="price" className="block mb-2 font-bold text-gray-600">Food Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Enter Price"
                            className="border border-gray-300 shadow p-3 w-full rounded"
                            {...register('price', { required: 'Price is required' })}
                        />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                    </div>

                    {/* Food Time Field */}
                    <div className="mb-5">
                        <label htmlFor="time" className="block mb-2 font-bold text-gray-600">Spend Time</label>
                        <div className="flex gap-4">
                            {/* Hours Input */}
                            <div className="w-1/2">
                                <label htmlFor="hours" className="block mb-2 text-sm font-medium text-gray-600">Hours</label>
                                <input
                                    type="number"
                                    id="hours"
                                    name="hours"
                                    min="0"
                                    placeholder="Enter Hours"
                                    className="border border-gray-300 shadow p-3 w-full rounded"
                                    {...register('hours', { required: 'Hours are required', min: 0 })}
                                />
                                {errors.hours && <p className="text-red-500 text-sm">{errors.hours.message}</p>}
                            </div>

                            {/* Minutes Input */}
                            <div className="w-1/2">
                                <label htmlFor="minutes" className="block mb-2 text-sm font-medium text-gray-600">Minutes</label>
                                <input
                                    type="number"
                                    id="minutes"
                                    name="minutes"
                                    min="0"
                                    max="59"
                                    placeholder="Enter Minutes"
                                    className="border border-gray-300 shadow p-3 w-full rounded"
                                    {...register('minutes', {
                                        required: 'Minutes are required',
                                        min: 0,
                                        max: {
                                            value: 59,
                                            message: 'Minutes must be between 0 and 59'
                                        }
                                    })}
                                />
                                {errors.minutes && <p className="text-red-500 text-sm">{errors.minutes.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Food Picture Field */}
                    <div className="mb-5">
                        <label htmlFor="image-input" className="block mb-2 font-bold text-gray-600">Food Picture</label>
                        <input
                            type="file"
                            accept=".jpeg, .jpg, .png"
                            {...register('image', { required: 'Food picture is required' })}
                            id="image-input"
                        />
                        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                    </div>

                    {/* Dynamic Ingredients Field */}
                    <div className="mb-5">
                        <label className="block mb-2 font-bold text-gray-600">Ingredients</label>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ingredient Name"
                                        className="border border-gray-300 shadow p-2 w-full rounded"
                                        {...register(`ingredients.${index}.name`, { required: 'Ingredient Name is required' })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Quantity"
                                        className="border border-gray-300 shadow p-2 w-full rounded"
                                        {...register(`ingredients.${index}.quantity`, { required: 'Quantity is required' })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => append({ name: '', quantity: '' })}
                            className="bg-blue-500 text-white font-bold p-2 rounded mt-3"
                        >
                            Add Ingredient
                        </button>
                    </div>

                    <button type="submit" className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg">
                        {loading ? <Loader /> : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
