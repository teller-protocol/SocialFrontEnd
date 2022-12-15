
// import { getToken } from 'next-auth/jwt'
// import { getSession } from 'next-auth/react'
// // import { auth, Client } from "twitter-api-sdk";
// import Twitter from 'twitter-lite';

export default async (req, res) => {
    // const sesh = await getSession({ req })
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    // console.log("token", token)
    // const client = new Twitter({
    //     subdomain: "api", // "api" is the default (change for other subdomains)
    //     version: "2", // version "1.1" is the default (change for other subdomains)
    //     extension: false,
    //     consumer_key: process.env.TWITTER_CONSUMER_KEY, // from Twitter.
    //     consumer_secret: process.env.TWITTER_CONSUMER_SECRET, // from Twitter.
    //     access_token_key: token.accessToken, // from your User (oauth_token)
    //     access_token_secret: token.refreshToken // from your User (oauth_token_secret)
    // });

    // // client
    // //     .get("account/verify_credentials")
    // //     .then(results => {
    // //         console.log("results", results);
    // //     })
    // //     .catch(console.error)

    // // client.get("users/me").then(res => {
    // //     res.statusCode = 200
    // //     res.data = response
    // // }).catch(error => {
    // //     res.statusCode = 400
    // //     res.data = error
    // // })
    // try {

    //     const results = await client.get('users/me')
    //     console.log("results", results)
    //     return res.status(200).json({
    //         status: "Ok",
    //         data: results

    //     })
    // } catch (e) {
    //     return res.status(400).json({
    //         status: e.message
    //     })
    // }
    // }
    // const sesh = await getSession({ req })
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    // console.log("token", token)

    try {
        //     const authClient = new auth.OAuth2User({
        //         client_id: process.env.TWITTER_CLIENT_ID,
        //         client_secret: process.env.TWITTER_CLIENT_SECRET,
        //         access_token: sesh.accessToken,
        //         callback: "http://127.0.0.1:3000/callback",
        //         scopes: ["users.read"],
        //     });
        //     const client = new Client(authClient)
        //     const getCurrentUser = await client.users.findMyUser()
        //     console.log("Current User : ", getCurrentUser)
        //     return res.status(200).json({
        //         status: "Ok",
        //         data: getCurrentUser
        //     })

        // return res.status(200).json({
        //     status: "Ok",
        //     data: []
        // })
    } catch (e) {
        // return res.status(400).json({
        //     status: e.message
        // })
        return res.status(400).json({
            status: e.message
        }

        )
    }
}
