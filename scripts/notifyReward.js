const fs = require('fs');
var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');

let web3 = new Web3(Web3.givenProvider || "http://localhost:9545");

const contractAddress = '0x7102794C5D331a9CC92Cf8256cE539931fBa6230';
const senderAddress = '0x45aE3DA8587Ac144679cBA1105ab53E8465eBd02'
const privateKey = '5930afb72f7cef81117e990d1595fe4e1796bcffa9e1a34104cddb310fd48424';
const rewardAmount = 450000;

const abiJson = fs.readFileSync('./scripts/unipool-abi.json', 'utf8');
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
            data: contract.methods.notifyRewardAmount(rewardAmount).encodeABI()
        };
        const tx = new Tx(txObject);
        const keyBuffer = Buffer.from(privateKey, 'hex');
        tx.sign(keyBuffer);
        const serializedTx = tx.serialize();
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('receipt', console.log);
    });
    
})
