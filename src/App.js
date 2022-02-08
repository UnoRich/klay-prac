import logo from './logo.svg';
import Caver from 'caver-js';
import './App.css';

const COUNT_CONTRACT_ADDRESS = '0x8377906Fc0ebeb1eC6739314E7681cbC2f0036Af';
const ACCESS_KEY_ID = 'KASK6O4PGR17DHO3LTHAO3Y7';
const SECRET_KEY_ID = '7bUlrjqmYEqRNl9MQNJhKxyE95G2cjnXE0WnPHDZ'

// ABI (Application Binary Interface)
// 사용설명서격 (smart contract API 명세를 간략히 뽑아주는역할로보임)
const COUNT_ABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "count",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBlockNumber",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
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
	}
]
const CHAIN_ID = '1001'; // MAINNET 8217 TESTNET 1001


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
const CountContract = new caver.contract(COUNT_ABI, COUNT_CONTRACT_ADDRESS);
const readCount = async () => {
  const _count = await CountContract.methods.count().call();
  console.log(_count);
}

const getBalance = (address) => {
	
  return caver.rpc.klay.getBalance(address).then((response) => {
    // 16진수 응답 문자열로 변경하여 Peb 단위로 표시
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
    console.log(`BALANCE: ${balance}`);
    return balance;
  });
}

const setCount = async (newCount) => {
	//  사용할 어카운트 설정
	try {
	const privateKey = '0x348bdacac4c2556ce10bbd62674cbef596b9298b3da3a34d471adaf45187fb3d'
	const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
	caver.wallet.add(deployer);
	// 스마트 컨트랙트 설정 트랜잭션 날리기
	// 결과화면

	const receipt = await CountContract.methods.setCount(newCount).send({
		from: deployer.address, //address
		gas: "0x4bfd200" // 이만큼 무조건쓰이는게 아니라 필요한만큼만 쓰임, 최소 설정??
	});
	console.log(receipt);
	} catch(e) {
		console.log('Error', e);
	}
}
// 1 smart contract 배포주소 확인
// 2 caver.js 이용해서 스마트 컨트랙트 이용하기
// 3 가져온 스마트 컨트랙트 실행결과(데이터) 웹에 표현하기

function App() {
  readCount();
  getBalance('0xa46644a4b323fd63d78f95ba5dd723fdfcf1dd5d');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
		<button title={'카운트 변경'}onClick={()=>{setCount(100)}} />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
