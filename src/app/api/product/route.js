import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/user.model";
import { Product } from "@/models/product.model";
import { connectDB } from "@/connectDB/connectDB";





export const GET = async (req) => {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }


        const { searchParams } = new URL(req?.url);
        const searchName = searchParams?.get("search")?.toLowerCase()?.trim();
        const searchProducts = searchParams?.get("products")?.toLowerCase()?.trim();

        if (searchProducts == 'all-products') {
            if (!searchName || searchName === 'null') {
                const allProduct = await Product.find();
                return NextResponse.json(allProduct, { status: 200 })
            } else {
                // If search term exists, filter products based on the search term
                const filteredProducts = await Product.find({
                    name: { $regex: searchName, $options: 'i' }, // Case-insensitive search
                });
                return NextResponse.json(filteredProducts, { status: 200 });
            }
        } else {
            const products = await Product.find({ author: session?.user?.userId }).populate("author");
            if (!searchName || searchName === 'null') {
                return NextResponse.json(products, { status: 200 })
            } else {
                // If search term exists, filter products based on the search term
                const filteredProducts = await Product.find({
                    name: { $regex: searchName, $options: 'i' }, // Case-insensitive search
                });

                // Check if filteredProducts are found
                if (filteredProducts.length === 0) {
                    return NextResponse.json({ message: 'No products found' }, { status: 404 });
                }

                return NextResponse.json(filteredProducts, { status: 200 });
            }
        }




    } catch (error) {
        console.log('product Get::', error?.message);
        return NextResponse.json(error.message, { status: 500 })
    }
}


export const POST = async (req) => {
    try {
        await connectDB();
        const { data } = await req.json();

        if (!data) {
            return NextResponse.json('user unAuthorized', { status: 401 })
        };

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json('user unAuthorized', { status: 401 })
        };

        const user = await User.findById(session?.user?.userId);
        if (!user) {
            return NextResponse.json('user not found', { status: 404 })
        }

        const existingProduct = await Product.findOne({ name: data?.name });
        if (existingProduct) {
            return NextResponse.json('Product already exist', { status: 400 })
        }

        const product = new Product({
            author: user._id,
            name: data?.name,
            price: data?.price,
            image: data?.image,
            ingredients: data?.ingredients || [],
            time: {
                hours: data.time.hours,
                minutes: data.time.minutes,
            },
        });

        await product.save();

        return NextResponse.json('successfull', { status: 200 })
    } catch (error) {
        console.log('product Post::', error?.message);
        return NextResponse.json(error.message, { status: 500 })
    }
}


export const DELETE = async (req) => {
    try {
        // Connect to the database
        await connectDB();

        // Extract testimonial ID from the request body
        const { id } = await req.json();

        // Step 1: Delete the testimonial from the testimonials collection
        const deletedTestimonial = await Product.findByIdAndDelete(id);

        if (!deletedTestimonial) {
            return NextResponse.json(
                { message: "Testimonial not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Delete product" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in DELETE:", error.message);
        return NextResponse.json(
            { message: "Error deleting testimonial", error: error.message },
            { status: 500 }
        );
    }
};


