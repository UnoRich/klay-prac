import Caver from 'caver-js';
// import CounterABI from '../abi/CounterABI.json'
import KIP17ABI from '../abi/KIP17TokenABI.json'
import { ACCESS_KEY_ID , SECRET_KEY_ID, NFT_CONTRACT_ADDRESS, CHAIN_ID} from '../constants/constants.cypress';

const option = {
    headers: [
        {
            name: "Authorization",
            value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_KEY_ID).toString("base64")
        },
        {
            name: "x-chain-id", value: CHAIN_ID
        }
    ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))

const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);


export const fetchCardOf = async (address) => {
    // fetch balance
    const balance = await NFTContract.methods.balanceOf(address).call();
    console.log(`[NFT Balance]${balance}`);

    // fetch token IDs
    const tokenIds = [];
    for (let i=0; i<balance; i++) {
        const id = await NFTContract.methods.tokenOfOwnerByIndex(address,i).call();
        tokenIds.push(id);
    }

    // fetch token URIs
    const tokenUris = [];
    for (let i=0; i<balance; i++) {
        const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
        tokenUris.push(uri);
    }

    const nfts = [];
    for (let i=0; i<balance; i++) {
        nfts.push({uri: tokenUris[i], id: tokenIds[i]});
    }
    console.log(nfts);
    return nfts;
}
export const getBalance = (address) => {

    return caver.rpc.klay.getBalance(address).then((response) => {
        // 16진수 응답 문자열로 변경하여 Peb 단위로 표시
        const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
        console.log(`BALANCE: ${balance}`);
        return balance;
    });
}

// const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);

// const readCount = async () => {
//     const _count = await CountContract.methods.count().call();
//     console.log(_count);
// }

// export const setCount = async (newCount) => {
//     //  사용할 어카운트 설정
//     try {
//         const privateKey = '0x348bdacac4c2556ce10bbd62674cbef596b9298b3da3a34d471adaf45187fb3d'
//         const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
//         caver.wallet.add(deployer);
//         // 스마트 컨트랙트 설정 트랜잭션 날리기
//         // 결과화면

//         const receipt = await CountContract.methods.setCount(newCount).send({
//             from: deployer.address, //address
//             gas: "0x4bfd200" // 이만큼 무조건쓰이는게 아니라 필요한만큼만 쓰임, 최소 설정??
//         });
//         console.log(receipt);
//     } catch (e) {
//         console.log('Error', e);
//     }
// }

