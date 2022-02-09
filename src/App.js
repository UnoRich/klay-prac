import React, { useState } from "react";
import logo from './logo.svg';
import QRCode from "qrcode.react";
import { getBalance, readCount, setCount } from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import './App.css';

// ABI (Application Binary Interface)
// 사용설명서격 (smart contract API 명세를 간략히 뽑아주는역할로보임)

// 1 smart contract 배포주소 확인
// 2 caver.js 이용해서 스마트 컨트랙트 이용하기
// 3 가져온 스마트 컨트랙트 실행결과(데이터) 웹에 표현하기

function onPressButton() {
	console.log('hi');
}

const onPressButton2 = (_balance, _setBalance) => {
	_setBalance(_balance);
}

const DEFAULT_QR_CODE = 'DEFAULT';
function App() {
	const [balance, setBlance] = useState('0');
	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);

	//   readCount();
	getBalance('0xBF819d77fB435DEFC7a5340B084BA64Fe03E0078');
	const onClickGetAddress = () => {
		KlipAPI.getAddress(setQrvalue);
		console.log(1111, qrvalue);
	}


	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<button title={'카운트 변경'} onClick={() => { setCount(100) }} />
				{/* <button onClick={() => { onPressButton2('15', setBlance) }} > HI </button> */}
				<button onClick={() => { onClickGetAddress() }} > 주소 가져오기 </button>
				<br />
				<QRCode value={qrvalue}></QRCode>
				<p>
					{balance}
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
