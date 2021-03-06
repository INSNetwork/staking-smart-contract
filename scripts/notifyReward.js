const fs = require('fs');
var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');

let web3 = new Web3(Web3.givenProvider || "http://localhost:9545");

const CHAIN_ID = 42
const contractAddress = '0x0A4cEE73d44aFA5EA3C8cf38B421b150A09012C9';
const senderAddress = '0xdeEA718176d46De0A9d1Ce3724C4738518A97979'
const privateKey = '';
const rewardAmount = 1000000000;

const abiJson = fs.readFileSync('/Users/jmeneses/Documents/Insights Network/staking-smart-contract/scripts/unipool-abi.json', 'utf8');
const contract = new web3.eth.Contract(JSON.parse(abiJson), contractAddress);

web3.eth.getGasPrice().then(gasPrice => {
    console.log(gasPrice)
    web3.eth.getTransactionCount(senderAddress, (err, txCount) => {
        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       contractAddress,
            gasLimit: web3.utils.toHex(process.env.GAS_LIMIT || 560000),
            gasPrice: web3.utils.toHex(gasPrice),
            value:    '0x0', // Not transferring any ethereum
            data: contract.methods.notifyRewardAmount(rewardAmount).encodeABI(),
            chain: CHAIN_ID,
        };
        console.log('Transaction:', txObject)
        const tx = new Tx(txObject, { chain: 'kovan' });
        const keyBuffer = Buffer.from(privateKey, 'hex');
        tx.sign(keyBuffer);
        const serializedTx = tx.serialize();
        console.log('sendSignedTransaction')
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('receipt', console.log);
    });
    
})
