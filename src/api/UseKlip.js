import axios from "axios"
import { MARKET_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from "../constants/constants.cypress";

const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = 'KLAY_MARKET';
const isMobile = window.screen.width >= 1280 ? false : true;

const getKlipAccessUrl = (method, request_key) => {
    if (method === 'QR') {
        return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;   
    }
    if (method === 'IOS') {
        return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`
    }
    if (method === 'android') {
        return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`
    }
    return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`
}
export const listingCard = async (
    fromAddress,
    tokenId,
    setQrvalue,
    callback
) => {
    // functionJson == ABI
    const functionJson = `
    {
		"constant": false,
		"inputs": [
			{
				"name": "from",
				"type": "address"
			},
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}`;
    executeContract(
        NFT_CONTRACT_ADDRESS, functionJson,
        "0",
        `[\"${fromAddress}\", \"${MARKET_CONTRACT_ADDRESS}\", \"${tokenId}\"]`,
        setQrvalue,
        callback);

};

export const buyCard = async (
    tokenId,
    setQrvalue,
    callback
) => {
    const functionJson = `{
		"constant": false,
		"inputs": [
			{
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"name": "NFTAddress",
				"type": "address"
			}
		],
		"name": "buyNFT",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	}`;
    executeContract(
        MARKET_CONTRACT_ADDRESS,
        functionJson,
        "10000000000000000",
        `[\"${tokenId}\", \"${NFT_CONTRACT_ADDRESS}\"]`,
        setQrvalue,
        callback
    );

};

export const mintCardWithURI = async (
    toAddress,
    tokenId,
    uri,
    setQrvalue,
    callback
) => {
    const functionJson = `{ "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }`;
    executeContract(NFT_CONTRACT_ADDRESS, functionJson, "0", `[\"${toAddress}\", \"${tokenId}\", \"${uri}\"]`, setQrvalue, callback);

};
export const executeContract = (txTo, functionJSON, value, params, setQrvalue, callback) => {
  // address from docs.klaytnwallet app2app api
    axios.post(
        A2P_API_PREPARE_URL, {
            bapp: {
                name: APP_NAME
            },
            type: "execute_contract",
            transaction: {
                to: txTo,
                // 부를 함수의 ABI를 통으로 스트링으로 전달
                abi: functionJSON,
                value: value,
                params: params,
            }
        }
    ).then((response) => {
        // const request_key = response.data.request_key;
        const { request_key } = response.data;
        if (isMobile) {
            window.location.href = getKlipAccessUrl("ios", request_key);
        } else {
            setQrvalue(getKlipAccessUrl("QR", request_key));
        }

        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
                if (res.data.result) {
                    console.log(`[result] ${JSON.stringify(res.data.result)}`);
                    callback(res.data.result);
                    clearInterval(timerId);
                    setQrvalue("DEFAULT");
                }
            })
        }, 1000)
    })
}


// get address of user wallet connected with QR
export const getAddress = (setQrvalue, callback) => {
    // address from docs.klaytnwallet app2app api
    axios.post(
        A2P_API_PREPARE_URL, {
            bapp: {
                name: APP_NAME
            },
            type: "auth"
        }
        ).then((response) => {
            // const request_key = response.data.request_key;
            const { request_key } = response.data;
            if (isMobile) {
                window.location.href = getKlipAccessUrl("ios", request_key);
            } else {
                setQrvalue(getKlipAccessUrl("QR", request_key));
            }
            
            let timerId = setInterval(() => {
                axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
                    if (res.data.result) {
                        console.log(`[result] ${JSON.stringify(res.data.result)}`);
                        callback(res.data.result.klaytn_address);
                        clearInterval(timerId);
                        setQrvalue("DEFAULT");
                    }
                })
            }, 1000)
        })
    }

    // export const setCount = (count, setQrvalue) => {
    //     // address from docs.klaytnwallet app2app api
    //     axios.post(
    //         A2P_API_PREPARE_URL, {
    //             bapp: {
    //                 name: APP_NAME
    //             },
    //             type: "execute_contract",
    //             transaction: {
    //                 to: COUNT_CONTRACT_ADDRESS,
    //                 // 부를 함수의 ABI를 통으로 스트링으로 전달
    //                 abi: `{
    //                     "constant": false,
    //                     "inputs": [
    //                         {
    //                             "name": "_count",
    //                             "type": "uint256"
    //                         }
    //                     ],
    //                     "name": "setCount",
    //                     "outputs": [],
    //                     "payable": false,
    //                     "stateMutability": "nonpayable",
    //                     "type": "function"
    //                 }`,
    //                 value: "0",
    //                 params: `["${count}"]`
    //             }
    //         }
    //     ).then((response) => {
    //         // const request_key = response.data.request_key;
    //         console.log("preapre next");
    //         const { request_key } = response.data;
    //         const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
    //         setQrvalue(qrcode);
    
    //         let timerId = setInterval(() => {
    //             axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
    //                 if (res.data.result) {
    //                     console.log(`[result] ${JSON.stringify(res.data.result)}`);
    //                     if (res.data.result.status == 'success') {
    //                         clearInterval(timerId);
    //                     }
    //                 }
    //             })
    //         }, 1000)
    //     })
    // }