import React, { useState } from "react";
import logo from './logo.svg';
import QRCode from "qrcode.react";
import { getBalance, readCount, setCount } from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import './market.css';
import { Alert, Container } from "react-bootstrap";

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
const DEFAULT_ADDRESS = "0x0000000000000000000000"
function App() {
	// state data

	// Global data
	// address
	// nft
	const [nfts, setNfts] = useState([]);
	const [myBalance, setMyBalance] = useState("0");
	const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);


	// UI
	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
	// tab
	// mintInput

	// Modal

	// fetchMarketNFTs
	// fetchMyNFTs
	// onClickMint
	// onClickMyCard
	// onClickMarketCard
	// getUserData
	const getUserData = () => {
		KlipAPI.getAddress(setQrvalue, async (address) => {
			setMyAddress(address);
			const _balance = await getBalance(address);
			setMyBalance(_balance);
		});
	}

	return (
		<div className="App">
			<div style={{ backgroundColor: "black", padding: 10 }}>
				<div style={{fontSize:30, fontWeight: "bold", paddingLeft:5, marginTop:10}}> 내 지갑</div>
				{myAddress}
				<br />
				<Alert 
				onClick={getUserData}
				variant={"balance"}
				style={{backgroundColor:"#f40075",
				fontSize:25}}>
					{myBalance}
				</Alert>
			</div>
			{/* 주소 잔고*/}
			<Container style={{ backgroundColor: 'white', width: 300, height: 300, padding: 20}}>
				<QRCode value={qrvalue} size={256} style={{margin:"auto"}} />
			</Container>
			{/* 갤러리(마켓, 내지갑)*/}
			{/* 발행 페이지*/}
			{/* 탭 */}
			{/* 모달 발행 페지 */}
		</div>
	);
}

export default App;
