import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import axios from "axios"
import TwitterLogin from "react-twitter-login";

export default function LotteryEntrance() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables

    const [loanAmt, setLoanAmt] = useState(0)
    const [loanDuration, setLoanDuration] = useState(0)
    const [loanInterest, setLoanInterest] = useState(0)
    const [twitterHandle, setTwitterHandle] = useState(null)

    const dispatch = useNotification()

    let tempLoanAmt = "0"
    let tempLoanDuration = "0"
    let tempLoanInterest = "0"
    let tempTwitterHandle = undefined

    const authHandler = (err, data) => {
        console.log(err, data);
    }


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
            _receiver: account

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

    async function getApiValues(tempTwitterHandle) {
        // const res = await fetch("http://127.0.0.1:8000/" + tempTwitterHandle)
        // const data = await res.json()
        // console.log(data)
        const url = "http://127.0.0.1:8000/" + tempTwitterHandle
        const response = await axios.get(url)
        let twitterScore = response.data.score ? response.data.score : 0

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
        } else if (twitterScore = 100) {
            tempLoanAmt = 2000000000
            tempLoanDuration = 2592000
            tempLoanInterest = 2000
        }
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

    useEffect(() => {
        if (isWeb3Enabled) {
            updateLoanTerms()
        }
    }, [isWeb3Enabled])
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
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl">Enter Your Twitter Handle</h1>
            {raffleAddress ? (
                <>
                    <TwitterLogin
                        authCallback={authHandler}
                        consumerKey={CONSUMER_KEY}
                        consumerSecret={CONSUMER_SECRET}
                    />
                    <button onClick={async () => {
                        tempTwitterHandle = document.getElementById("twitterHandle").value
                        await getApiValues(tempTwitterHandle)
                        updateLoanTerms()
                    }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-auto" type="button" id="twitterButton" > Check Loan Terms </button>
                    {loanAmt !== "0" ? (
                        <>
                            <div>Loan Amt : {loanAmt / 10 ** 6 + " USDC"}</div>
                            <div>Loan Duration : {loanDuration / (60 * 60 * 24) + " days"}</div>
                            <div>Loan Interest : {loanInterest / 100 + " %"}</div>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-auto" type="button" id="loanRequestButton"
                                onClick={async () => {
                                    console.log("Submitting Bid", loanAmt, loanDuration, loanInterest, twitterHandle, account)
                                    await submitBid({
                                        // onComplete:
                                        // onError:
                                        onSuccess: handleSuccess,
                                        onError: (error) => console.log(error),
                                    })
                                }
                                }
                                disabled={isLoading || isFetching}



                            >Submit Loan Request</button>
                        </>


                    ) : (<div></div>)}

                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    )
}
