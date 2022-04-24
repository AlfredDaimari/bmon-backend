/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");
let user, choice, arg1, arg2, arg3, arg4;

process.argv.forEach(function (val, index, array) {
    // console.log(index + ': ' + val);
    choice = array[2];
    user = array[3];
    arg1 = array[4];
    arg2 = array[5];
    arg3 = array[6]
    arg4 = array[7]
});

async function main() {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.

        const identity = await wallet.get(user);
        if (!identity) {
            console.log(`An identity for the user ${user} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("fabcar");

        // Submit the specified transaction.
        // hello transaction - requires 3 argument (3rd argument is username), ex: ('hello', 'user1', 'lakhanboy')
        // request transaction - requires 4 arguments , ex: ('request', 'user1', 'cardreq or gamereq', 'url/card info', 'alias')
        // coinRequest transaction - requires 5 (last is reward) arguments, ex: ('coinReqest', 'gamemaker1' ,'username1', 'username2', '45')
        // tradingRequest transaction - requires 5 args, ex: ('tradingRequest', 'user1' ,'lakhanboy' ,'[5,7,8]', '[1,2,3,4]')
        // voteForRequest transaction - requires 3 args (last is request ID) , ex: ('voteForRequest', 'user1', '3')
        // updateRequest transaction - requires 6 args ex: ('updateRequest', 'user1', 'itemID' ,'winner/0', 'accepted/unaccepted')
        // buyAsset transaction - requires4 args ex: ('buyAsset', 'user1', 'itemID', '["1", "2", "3"]')

        if (choice === "hello") {
            await contract.submitTransaction("hello", arg1);
            console.log(`${choice} Transaction has been submitted`);
        } else if (choice === "request") {
            await contract.submitTransaction("request", arg1, arg2, arg3);
            console.log(`${choice} Transaction has been submitted`);
        } else if (choice === "coinRequest") {
            const result = await contract.submitTransaction("coinRequest", arg1, arg2, arg3);
            console.log(`${choice} Transaction has been submitted`);
            console.log(
                `TransactionTypeAll has been evaluated, result is: ${result.toString()}`
            );
        } else if (choice === "tradeRequest") {
            await contract.submitTransaction("tradeRequest", arg1, arg2, arg3);
            console.log(`${choice} Transaction has been submitted`);
        } else if (choice === "voteForRequest") {
            await contract.submitTransaction("voteForRequest", arg1);
            console.log(`${choice} Transaction has been submitted`);
        } else if (choice === "updateRequest") {
            await contract.submitTransaction("updateRequest", arg1, arg2, arg3);
            console.log(`${choice} Transaction has been submitted`);
        } else if (choice === "buyAsset") {
            const result = await contract.submitTransaction("buyAsset", arg1, arg2);
            console.log(`${choice} Transaction has been submitted`);
            console.log(
                `TransactionTypeAll has been evaluated, result is: ${result.toString()}`
            );
        } else {
            console.log(`${choice} is invalid!`);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
