import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import connectDB from './db/db'
import User from './db/models/userModel'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        await connectDB()
        const existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image
          })

          token._id = newUser._id
        } else {
          token._id = existingUser._id
        }
      }

      return token
    },
    async session({ session, token }: any) {
      session._id = token._id
      return session
    }
  }
})
