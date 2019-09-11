// Copyright 2019 OpenST Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------------------------------------------------------

import 'mocha';

import BigNumber from 'bignumber.js';

import Request from '../../../src/models/Request';
import Repositories from '../../../src/repositories/Repositories';
import assert from '../../test_utils/assert';
import Util from './util';

interface TestConfigInterface {
  repos: Repositories;
}
let config: TestConfigInterface;

describe('RequestRepository::save', (): void => {
  beforeEach(async (): Promise<void> => {
    config = {
      repos: await Repositories.create(),
    };
  });

  it('Checks creation.', async (): Promise<void> => {
    const requestInput = new Request(
      'requestHash',
      new BigNumber('10'),
      new BigNumber('1'),
      'beneficiary',
      new BigNumber('2'),
      new BigNumber('3'),
      new BigNumber('4'),
      'gateway',
      'sender',
      'senderProxy',
    );

    const requestResponse = await config.repos.requestRepository.save(
      requestInput,
    );

    Util.checkInputAgainstOutput(
      requestInput,
      requestResponse,
    );

    const requestOutput = await config.repos.requestRepository.get(
      requestInput.requestHash,
    );

    assert.notStrictEqual(
      requestOutput,
      null,
      'Newly created request does not exist.',
    );

    Util.checkInputAgainstOutput(
      requestInput,
      requestOutput as Request,
    );
  });

  it('Checks update.', async (): Promise<void> => {
    const requestInput = new Request(
      'requestHash',
      new BigNumber('10'),
      new BigNumber('1'),
      'beneficiary',
      new BigNumber('2'),
      new BigNumber('3'),
      new BigNumber('4'),
      'gateway',
      'sender',
      'senderProxy',
    );

    await config.repos.requestRepository.save(
      requestInput,
    );

    const requestUpdateInput = new Request(
      'requestHash',
      requestInput.blockNumber,
    );
    requestUpdateInput.amount = new BigNumber('11');
    requestUpdateInput.gateway = 'gatewayUpdated';

    const requestResponse = await config.repos.requestRepository.save(
      requestUpdateInput,
    );

    Util.checkInputAgainstOutput(
      new Request(
        requestInput.requestHash,
        requestInput.blockNumber,
        requestUpdateInput.amount,
        requestInput.beneficiary,
        requestInput.gasPrice,
        requestInput.gasLimit,
        requestInput.nonce,
        requestUpdateInput.gateway,
        requestUpdateInput.sender,
        requestUpdateInput.senderProxy,
        requestInput.messageHash,
      ),
      requestResponse,
    );

    const requestOutput = await config.repos.requestRepository.get(
      requestInput.requestHash,
    );

    assert.notStrictEqual(
      requestOutput,
      null,
      'Newly updated request exists.',
    );

    Util.checkInputAgainstOutput(
      new Request(
        requestInput.requestHash,
        requestInput.blockNumber,
        requestUpdateInput.amount,
        requestInput.beneficiary,
        requestInput.gasPrice,
        requestInput.gasLimit,
        requestInput.nonce,
        requestUpdateInput.gateway,
        requestUpdateInput.sender,
        requestUpdateInput.senderProxy,
        requestInput.messageHash,
      ),
      requestOutput as Request,
    );
  });
});
