
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');


async function query(user, id, arg1 = "") {
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
        let result;
        switch (id) {
            case 0:
                result = await contract.evaluateTransaction("queryAllItems");
                console.log(
                    `transaction has been evaluated, result is: ${result.toString()}`
                );
                return result
            case 1:
                result = await contract.evaluateTransaction("queryAssets");
                console.log(
                    `transaction has been evaluated, result is: ${result.toString()}`
                );
                return result
            case 2:
                result = await contract.evaluateTransaction("queryRequests");
                console.log(
                    `transaction has been evaluated, result is: ${result.toString()}`
                );
                return result

            case 3:
                result = await contract.evaluateTransaction("queryTradeRequests");
                console.log(
                    `transaction has been evaluated, result is: ${result.toString()}`
                );
                return result
            case 4:
                result = await contract.evaluateTransaction("queryItem", arg1);
                console.log(
                    `transaction has been evaluated, result is: ${result.toString()}`
                );
                return result
            case 5:
                result = await contract.evaluateTransaction("queryMyItems");
                console.log(
                    `transaction has been evaluated, result is: ${result.toString()}`
                );
                return result
            default:
                console.error(`failed to evaluate query: ${id}`);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

module.exports = query