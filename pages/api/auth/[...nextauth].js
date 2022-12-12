import NextAuth from 'next-auth'
import TwitterProvider from "next-auth/providers/twitter"

export default NextAuth({
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            version: "2.0",

        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token to the token right after signin
            // console.log("token", token)
            // console.log("account", account)
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.username = await profile.data.username

            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.user.username = token.username

            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
})