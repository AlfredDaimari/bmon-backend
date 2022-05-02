/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

let user, msgID, arg1;

process.argv.forEach(function (val, index, array) {
    // console.log(index + ': ' + val);
    msgID = array[3];
    user = array[2];
    arg1 = array[4]
});


async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(user);
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        // Evaluate the specified transaction.
        // queryMsg transaction - requires 1 argument, ex: ('queryMsg', 'MSG0')
        // queryAllMsgs transaction - requires no arguments, ex: ('queryAllMsgs')
        if (msgID === "0") {
            const result = await contract.evaluateTransaction("queryAllItems");
            console.log(
                `TransactionTypeAll has been evaluated, result is: ${result.toString()}`
            );
        } else if (msgID === "1") {
            const result = await contract.evaluateTransaction("queryAssets");
            console.log(
                `TransactionTypeAll has been evaluated, result is: ${result.toString()}`
            );
        } else if (msgID === "2") {
            const result = await contract.evaluateTransaction("queryRequests");
            console.log(
                `TransactionTypeAll has been evaluated, result is: ${result.toString()}`
            );

        } else if (msgID === "3") {
            const result = await contract.evaluateTransaction("queryTradeRequests");
            console.log(
                `TransactionTypeAll has been evaluated, result is: ${result.toString()}`
            );
        } else if (msgID === "4") {
            const result = await contract.evaluateTransaction("queryItem", arg1);
            console.log(
                `TransactionTypeAll has been evaluated, result is: ${result.toString()}`
            );
        } else {
            const result = await contract.evaluateTransaction("queryMyItems");
            console.log(
                `TransactionTypeID has been evaluated, result is: ${result.toString()}`
            );
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
