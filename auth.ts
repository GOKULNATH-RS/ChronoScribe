import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import connectDB from './db/db'
import User from './db/models/userModel'

declare module 'next-auth' {
  interface Session {
    _id: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        await connectDB()

        const existingUser = await User.findOne({ email: user.email })

        if (existingUser) {
          token._id = existingUser._id
        } else {
          const newUser = new User({
            email: user.email,
            username: user.name,
            image_url: user?.image
          })

          await newUser.save()
          token._id = newUser._id
        }
      }

      return token
    },
    async session({ session, token }) {
      session._id = token._id as string
      return session
    }
  }
})
