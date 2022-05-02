const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");


async function invoke(choice, user, arg1 = "", arg2 = "", arg3 = "", arg4 = "") {
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
            return false;   // for logging in user
        }


        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("fabcar");

        switch (choice) {
            case 'login':
                return true
            case 'hello':
                await contract.submitTransaction("hello", arg1);
                console.log(`${choice} transaction has been submitted`);
                return true
            case 'traderequest':
                console.log(arg1, arg2, arg3)
                await contract.submitTransaction("tradeRequest", arg1, arg2, arg3);
                console.log(`${choice} transaction has been submitted`);
                return true
            case 'voteforrequest':
                await contract.submitTransaction("voteForRequest", arg1);
                console.log(`${choice} transaction has been submitted`);
                return true
            case 'updaterequest':
                await contract.submitTransaction("updateRequest", arg1, arg2, arg3);
                console.log(`${choice} transaction has been submitted`);
                return true
            case 'buyasset':
                result = await contract.submitTransaction("buyAsset", arg1, arg2);
                console.log(`${choice} transaction has been submitted`);
                console.log(
                    `transaction has been evaluated, result is: ${result.toString()}`
                );
                return true
            // all gamer maker types
            case 'coinrequest':
                result = await contract.submitTransaction("coinRequest", arg1, arg2, arg3, arg4);
                console.log(`${choice} Transaction has been submitted`);
                console.log(
                    `TransactionTypeAll has been evaluated, result is: ${result.toString()}`
                );
                return true
            default:
                console.log(`${choice} is invalid!`);
                return false
        }


    } catch (error) {
        console.error(`failed to submit transaction: ${error}`);
        return false
    }
}


module.exports = invoke