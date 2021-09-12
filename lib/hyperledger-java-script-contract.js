/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class HyperledgerJavaScriptContract extends Contract {

    async hyperledgerJavaScriptExists(ctx, hyperledgerJavaScriptId) {
        const buffer = await ctx.stub.getState(hyperledgerJavaScriptId);
        return (!!buffer && buffer.length > 0);
    }

    async createHyperledgerJavaScript(ctx, hyperledgerJavaScriptId, value) {
        const exists = await this.hyperledgerJavaScriptExists(ctx, hyperledgerJavaScriptId);
        if (exists) {
            throw new Error(`The hyperledger java script ${hyperledgerJavaScriptId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hyperledgerJavaScriptId, buffer);
    }

    async readHyperledgerJavaScript(ctx, hyperledgerJavaScriptId) {
        const exists = await this.hyperledgerJavaScriptExists(ctx, hyperledgerJavaScriptId);
        if (!exists) {
            throw new Error(`The hyperledger java script ${hyperledgerJavaScriptId} does not exist`);
        }
        const buffer = await ctx.stub.getState(hyperledgerJavaScriptId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateHyperledgerJavaScript(ctx, hyperledgerJavaScriptId, newValue) {
        const exists = await this.hyperledgerJavaScriptExists(ctx, hyperledgerJavaScriptId);
        if (!exists) {
            throw new Error(`The hyperledger java script ${hyperledgerJavaScriptId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hyperledgerJavaScriptId, buffer);
    }

    async deleteHyperledgerJavaScript(ctx, hyperledgerJavaScriptId) {
        const exists = await this.hyperledgerJavaScriptExists(ctx, hyperledgerJavaScriptId);
        if (!exists) {
            throw new Error(`The hyperledger java script ${hyperledgerJavaScriptId} does not exist`);
        }
        await ctx.stub.deleteState(hyperledgerJavaScriptId);
    }

}

module.exports = HyperledgerJavaScriptContract;
