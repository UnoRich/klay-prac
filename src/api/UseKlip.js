import axios from "axios"
import { COUNT_CONTRACT_ADDRESS } from "../constants/constants.cypress";

const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = 'KLAY_MARKET';
export const setCount = (count, setQrvalue) => {
    // address from docs.klaytnwallet app2app api
    axios.post(
        A2P_API_PREPARE_URL, {
            bapp: {
                name: APP_NAME
            },
            type: "execute_contract",
            transaction: {
                to: COUNT_CONTRACT_ADDRESS,
                // 부를 함수의 ABI를 통으로 스트링으로 전달
                abi: `{
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_count",
                            "type": "uint256"
                        }
                    ],
                    "name": "setCount",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                }`,
                value: "0",
                params: `["${count}"]`
            }
        }
    ).then((response) => {
        // const request_key = response.data.request_key;
        console.log("preapre next");
        const { request_key } = response.data;
        const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
        setQrvalue(qrcode);

        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
                if (res.data.result) {
                    console.log(`[result] ${JSON.stringify(res.data.result)}`);
                    if (res.data.result.status == 'success') {
                        clearInterval(timerId);
                    }
                }
            })
        }, 1000)
    })
}

// get address of user wallet connected with QR
export const getAddress = (setQrvalue) => {
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
        console.log("preapre next");
        const { request_key } = response.data;
        const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
        setQrvalue(qrcode);

        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
                if (res.data.result) {
                    console.log(`[result] ${JSON.stringify(res.data.result)}`);
                    clearInterval(timerId);
                }
            })
        }, 1000)
    })
}