import { connectDB } from "@/connectDB/connectDB";
import { User } from "@/models/user.model";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })

    ],


    // callbacks
    callbacks: {
        async signIn({ account, profile, user }) {
            try {
                await connectDB();
                let existingUser = await User.findOne({ email: profile.email })
                if (account.provider === "google") {
                    let authId;
                    if (existingUser) {
                        authId = existingUser._id
                    } else {
                        const newUser = new User({
                            name: profile.name,
                            email: profile.email,
                            authProvider: account.provider,
                            image: profile?.picture
                        });
                        await newUser.save();
                        authId = newUser._id
                    }
                    user.id = authId
                }
                return true
            } catch (error) {
                console.log(error?.message);
            }
        },



        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.userId = token.userId;
            session.user.email = token.email;
            return session;
        },
    }
}

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
