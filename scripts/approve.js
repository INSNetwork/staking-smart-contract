const fs = require('fs');
var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(
    'https://kovan.infura.io/v3/d81ab7e6cb51480fbf25ad70081c0f15'
));
const contractAddress = '0x149eE47d4d4eeb9C0a3FBe38750aa0b13e1E2f08';
const senderAddress = '0xdeEA718176d46De0A9d1Ce3724C4738518A97979'
const privateKey = '0319304d8fa0049a837b5600cf22d8fd046f4f8e15fa028aaaa533c65ccd703e';
const abiJson = fs.readFileSync('./erc20-abi.json', 'utf8');
const contract = new web3.eth.Contract(JSON.parse(abiJson), contractAddress);
web3.eth.getGasPrice().then(gasPrice => {
    console.log(gasPrice)
    web3.eth.getTransactionCount(senderAddress, (err, txCount) => {
        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       contractAddress,
            gasLimit: web3.utils.toHex(process.env.GAS_LIMIT || 560000),
            gasPrice: web3.utils.toHex(gasPrice),
            value:    '0x0',
            data: contract.methods.approve('0x0A4cEE73d44aFA5EA3C8cf38B421b150A09012C9', 1000000000).encodeABI()
        };
        console.log('Transaction:', txObject)
        const tx = new Tx(txObject, {chain: 42});
        const keyBuffer = Buffer.from(privateKey, 'hex');
        tx.sign(keyBuffer);
        const serializedTx = tx.serialize();
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('receipt', console.log);
    });
})
