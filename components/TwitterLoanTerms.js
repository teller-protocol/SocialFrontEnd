import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import axios from "axios"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from 'next/link'



export default function TwitterLoanTerms() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex, account: walletAddress } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables

    const [loanAmt, setLoanAmt] = useState(0)
    const [loanDuration, setLoanDuration] = useState(0)
    const [loanInterest, setLoanInterest] = useState(0)
    const [twitterHandle, setTwitterHandle] = useState("")
    const [loanTermsLoading, setLoanTermsLoading] = useState(false)
    const [loanTermsProvided, setLoanTermsProvided] = useState(false)

    const dispatch = useNotification()
    const { data: session } = useSession()

    let tempLoanAmt = 0
    let tempLoanDuration = 0
    let tempLoanInterest = 0
    let tempTwitterHandle = ""
    let tempLoanTermsLoading = false
    let tempLoanTermsProvided = false





    const {
        runContractFunction: submitBid,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "submitBid",
        params: {
            _lendingToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            _marketplaceId: 25,
            _principal: loanAmt,
            _duration: loanDuration,
            _APR: loanInterest,
            _metadataURI: twitterHandle,
            _receiver: walletAddress

        },
    })

    // const {
    //     runContractFunction: enterRaffle,
    //     data: enterTxResponse,
    //     isLoading,
    //     isFetching,
    // } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: raffleAddress,
    //     functionName: "enterRaffle",
    //     msgValue: entranceFee,
    //     params: {},
    // })


    function updateLoanTerms() {
        setLoanAmt(tempLoanAmt)
        setLoanDuration(tempLoanDuration)
        setLoanInterest(tempLoanInterest)
        setTwitterHandle(tempTwitterHandle)

    }



    async function getApiValues() {
        // const res = await fetch("http://127.0.0.1:8000/" + tempTwitterHandle)
        // const data = await res.json()
        // console.log(data)
        console.log("SESSION: ", session)
        tempLoanTermsLoading = true
        setLoanTermsLoading(tempLoanTermsLoading)
        console.log("Loan terms loading: ", loanTermsLoading)
        setTwitterHandle(session.user.username)
        tempTwitterHandle = session.user.username
        console.log("TWITTER HANDLE: ", tempTwitterHandle)
        const url = `http://127.0.0.1:8000/${tempTwitterHandle}`
        console.log(url)
        const response = await axios.get(url)
        let twitterScore = response.data.score ? response.data.score : 0
        console.log("TWITTER SCORE: ", twitterScore)
        if (twitterScore > 0 && twitterScore < 10) {
            tempLoanAmt = 100000000
            tempLoanDuration = 2592000
            tempLoanInterest = 2000
        } else if (twitterScore >= 10 && twitterScore < 20) {
            tempLoanAmt = 500000000
            tempLoanDuration = 2592000
            tempLoanInterest = 2000
        } else if (twitterScore >= 20 && twitterScore < 50) {
            tempLoanAmt = 1000000000
            tempLoanDuration = 2592000
            tempLoanInterest = 2000
        } else if (twitterScore >= 50 && twitterScore < 100) {
            tempLoanAmt = 1500000000
            tempLoanDuration = 2592000
            tempLoanInterest = 2000
        } else if (twitterScore === 100) {
            tempLoanAmt = 2000000000
            tempLoanDuration = 2592000
            tempLoanInterest = 2000
        } else {
            tempLoanAmt = 0
            tempLoanDuration = 0
            tempLoanInterest = 0
        }
        console.log("LOAN AMT: ", tempLoanAmt)
        tempLoanTermsLoading = false
        tempLoanTermsProvided = true
        setLoanTermsLoading(tempLoanTermsLoading)
        setLoanTermsProvided(tempLoanTermsProvided)
        updateLoanTerms()



        // var axios = require('axios');
        // var qs = require('qs');
        // // var data = qs.stringify({

        // // });
        // var config = {
        //     method: 'get',
        //     url: "http://127.0.0.1:8000/" + tempTwitterHandle,
        //     headers: {
        //         'accept': 'application/json'
        //     },
        //     data: data
        // };

        // axios(config)
        //     .then(function (response) {
        //         console.log(JSON.stringify(response));
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

    }

    // useEffect(() => {
    //     if (isWeb3Enabled) {
    //         updateLoanTerms()
    //     }
    // }, [isWeb3Enabled])
    // no list means it'll update everytime anything changes or happens
    // empty list means it'll run once after the initial rendering
    // and dependencies mean it'll run whenever those things in the list change

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-5">
            {session ?
                (<><h3 className="font-bold">Signed in as {session.user.name}</h3>
                    <br />
                    <button className="bg-blue-200 hover:bg-blue-500 text-black font-bold py-2 px-4 rounded ml-auto" type="button" id="signout" onClick={() => {
                        signOut()

                    }}>Sign out from Twitter</button>

                    {raffleAddress ? (
                        <div>

                            {(tempLoanTermsProvided == true || loanTermsProvided == true) ? (
                                <>  <div className="group  py-4 px-4 hover:shadow-lg ">


                                    <div className="text-xl font-semibold">Loan Amount : {loanAmt != 0 ? loanAmt / 10 ** 6 : 0} USDC</div>
                                    <div className="text-xl font-semibold">Loan Duration : {loanAmt != 0 ? loanDuration / (60 * 60 * 24) : 0} days</div>
                                    <div className="text-xl font-semibold">Loan APY : {loanInterest != 0 ? loanInterest / 100 : 0} %</div>
                                </div>
                                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-auto" type="button" id="SubmitLoanRequest"
                                        onClick={async () => {
                                            console.log("Submitting Bid", loanAmt, loanDuration, loanInterest, twitterHandle, walletAddress)
                                            await submitBid({
                                                // onComplete:
                                                // onError:
                                                onSuccess: handleSuccess,
                                                onError: (error) => console.log(error),
                                            })
                                        }
                                        }
                                        disabled={isLoading || isFetching}



                                    >{isLoading || isFetching ? (<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>) : (<><div>Submit Loan Request</div>
                                    </>)}</button>
                                    <br />
                                    <br />

                                    <div class="grid-child-element">Once the trx is submitted go <Link href="https://app.teller.org/polygon/market/25">
                                        <a className="underline">here</a>
                                    </Link> to check the loan status</div>

                                </>


                            ) : (<>
                                <br />
                                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-auto" type="button" id="RequestLoanTerms"
                                    onClick={async () => {
                                        console.log("Requesting Loan Terms for", walletAddress)
                                        await getApiValues()
                                    }
                                    }
                                    disabled={loanTermsLoading}
                                >{loanTermsLoading ? (<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>) : (<div>Request Loan Terms</div>)}</button></>)}

                        </div>
                    ) : (
                        <div>Please connect to a supported chain </div>
                    )}


                </>) : (<>
                    <h3 className="py-2 text-xl "> Sign into Twitter to provide loan terms</h3>
                    <button className="bg-blue-200 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded ml-auto" type="button" id="SubmitLoanRequest" onClick={async () => {
                        await signIn()
                    }}>Sign in</button>
                </>)}
            {/* <h1 className="py-4 px-4 font-bold text-3xl">Enter Your Twitter Handle</h1> */}

        </div>
    )
}
