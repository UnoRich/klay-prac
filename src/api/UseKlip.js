import axios from "axios"

// get address of user wallet connected with QR
export const getAddress = (setQrvalue) => {
    // address from docs.klaytnwallet app2app api
    axios.post(
        "https://a2a-api.klipwallet.com/v2/a2a/prepare", {
            bapp: {
                name: 'KLAY_MARKET'
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