var CryptoJS = require("crypto-js");
var express = require("express");
class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        var fields=this.data.split(/ /);
        this.name=fields[0];
        this.id=fields[1];
        this.hash = hash.toString();
    }
}
var getGenesisBlock = () => {
    return new Block(0, "0", 1539335423.159, "Genesis Block!!", "b2d6355878606e2d21069235f4f831ac47a3aa9a83dc855b128b306946a2f7af");
};
var blockchain = [getGenesisBlock()];
var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};
var calculateHashForBlock = (block) => {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};
var calculateHash = (index, previousHash, timestamp, data) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};
var addBlock = (newBlock) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};
var isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};
var getLatestBlock = () => blockchain[blockchain.length - 1];
var newBlock=addBlock(generateNextBlock("ram 24"));
console.log(blockchain);
console.log(blockchain[1].name,blockchain[1].id);