'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
    const router = useRouter();
    const { data: session } = useSession();


    const navLinks = [
        { name: "Home", href: "/dashboard" },
        { name: "My Recipe", href: "/dashboard/myrecipe" },
        { name: "Projects", href: "/Projects" },
    ];

    return (
        <header className="relative">
            <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 shadow-md">
                <ul className="max-w-[100%] flex justify-between items-center mx-auto py-4 px-4 md:px-8">
                    {/* Logo */}
                    <Link href="/" className="logo">
                        <h3 className="font-bold text-2xl">LOGO</h3>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <input type="checkbox" id="check" className="hidden peer" />
                    <label
                        htmlFor="check"
                        className="open-menu cursor-pointer md:hidden text-xl text-gray-700"
                    >
                        &#9776;
                    </label>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-x-2">
                        <span
                            className="menu absolute left-0 top-16 w-full bg-white flex flex-col items-center gap-4 py-4 md:flex-row md:relative md:w-auto md:gap-8 md:py-0 md:top-0 md:bg-transparent 
            peer-checked:flex peer-checked:top-16"
                        >
                            {navLinks.map((link) => (
                                <li key={link.href} className="list-none">
                                    <Link
                                        href={link.href}
                                        className={`${router.pathname === link.href
                                            ? "text-blue-500 font-bold border-b-2 border-blue-500"
                                            : "text-gray-800 hover:text-blue-500"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}

                            {/* Close Menu for Mobile */}
                            <label
                                htmlFor="check"
                                className="close-menu cursor-pointer md:hidden absolute top-4 right-8 text-xl"
                            >
                                &#10005;
                            </label>
                        </span>

                        {/* Avatar */}
                        {session?.user?.image ? (
                            <div className="avatar ml-4 md:ml-8">
                                <Image
                                    src={session?.user?.image}
                                    alt="User Avatar"
                                    fill
                                    style={{
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        ) : (
                            <Link
                                href="/api/auth/signin"
                                className="text-blue-500 font-medium hover:underline"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
