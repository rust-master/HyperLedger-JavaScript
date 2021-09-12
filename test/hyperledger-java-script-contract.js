/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { HyperledgerJavaScriptContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('HyperledgerJavaScriptContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new HyperledgerJavaScriptContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"hyperledger java script 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"hyperledger java script 1002 value"}'));
    });

    describe('#hyperledgerJavaScriptExists', () => {

        it('should return true for a hyperledger java script', async () => {
            await contract.hyperledgerJavaScriptExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a hyperledger java script that does not exist', async () => {
            await contract.hyperledgerJavaScriptExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createHyperledgerJavaScript', () => {

        it('should create a hyperledger java script', async () => {
            await contract.createHyperledgerJavaScript(ctx, '1003', 'hyperledger java script 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"hyperledger java script 1003 value"}'));
        });

        it('should throw an error for a hyperledger java script that already exists', async () => {
            await contract.createHyperledgerJavaScript(ctx, '1001', 'myvalue').should.be.rejectedWith(/The hyperledger java script 1001 already exists/);
        });

    });

    describe('#readHyperledgerJavaScript', () => {

        it('should return a hyperledger java script', async () => {
            await contract.readHyperledgerJavaScript(ctx, '1001').should.eventually.deep.equal({ value: 'hyperledger java script 1001 value' });
        });

        it('should throw an error for a hyperledger java script that does not exist', async () => {
            await contract.readHyperledgerJavaScript(ctx, '1003').should.be.rejectedWith(/The hyperledger java script 1003 does not exist/);
        });

    });

    describe('#updateHyperledgerJavaScript', () => {

        it('should update a hyperledger java script', async () => {
            await contract.updateHyperledgerJavaScript(ctx, '1001', 'hyperledger java script 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"hyperledger java script 1001 new value"}'));
        });

        it('should throw an error for a hyperledger java script that does not exist', async () => {
            await contract.updateHyperledgerJavaScript(ctx, '1003', 'hyperledger java script 1003 new value').should.be.rejectedWith(/The hyperledger java script 1003 does not exist/);
        });

    });

    describe('#deleteHyperledgerJavaScript', () => {

        it('should delete a hyperledger java script', async () => {
            await contract.deleteHyperledgerJavaScript(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a hyperledger java script that does not exist', async () => {
            await contract.deleteHyperledgerJavaScript(ctx, '1003').should.be.rejectedWith(/The hyperledger java script 1003 does not exist/);
        });

    });

});
