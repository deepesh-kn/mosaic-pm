// Copyright 2020 OpenST Ltd.
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


import BigNumber from 'bignumber.js';

import Util from './util';
import { assertErrorMessages } from '../../../test_utils/assert';
import Message, { MessageStatus, MessageType } from '../../../../src/m1_facilitator/models/Message';
import Repositories from '../../../../src/m1_facilitator/repositories/Repositories';

describe('MessageRepository::save', (): void => {
  let config: {
    repos: Repositories;
  };
  let messageHash: string;
  let intentHash: string;
  let type: MessageType;
  let sourceStatus: MessageStatus;
  let targetStatus: MessageStatus;
  let gasPrice: BigNumber;
  let gasLimit: BigNumber;
  let gatewayAddress: string;
  let sourceDeclarationBlockNumber: BigNumber;
  let createdAt: Date;
  let updatedAt: Date;

  beforeEach(async (): Promise<void> => {
    config = {
      repos: await Repositories.create(),
    };
    messageHash = '0x00000000000000000000000000000000000000000000000000000000000000333';
    type = MessageType.Deposit;
    intentHash = '0x00000000000000000000000000000000000000000000000000000000000100';
    sourceStatus = MessageStatus.Undeclared;
    targetStatus = MessageStatus.Undeclared;
    gasPrice = new BigNumber('30000000000000000000000000000000');
    gasLimit = new BigNumber('10000000000000000000000000000000');
    gatewayAddress = '0x0000000000000000000000000000000000000001';
    sourceDeclarationBlockNumber = new BigNumber(300);
    createdAt = new Date();
    updatedAt = new Date();
  });

  it('should successfully create Message model.', async (): Promise<void> => {
    const message = new Message(
      messageHash,
      type,
      sourceStatus,
      targetStatus,
      gatewayAddress,
      intentHash,
      gasPrice,
      gasLimit,
      sourceDeclarationBlockNumber,
      createdAt,
      updatedAt,
    );
    const createdMessage = await config.repos.messageRepository.save(
      message,
    );

    Util.assertMessageAttributes(createdMessage, message);
  });

  it('should pass when updating Message model', async (): Promise<void> => {
    const message = new Message(
      messageHash,
      type,
      sourceStatus,
      targetStatus,
      gatewayAddress,
      intentHash,
      gasPrice,
      gasLimit,
      sourceDeclarationBlockNumber,
      createdAt,
      updatedAt,
    );

    await config.repos.messageRepository.save(
      message,
    );

    message.sourceStatus = MessageStatus.Declared;
    message.targetStatus = MessageStatus.Declared;
    message.gasPrice = new BigNumber('30000000000000000000000000000001');
    message.gatewayAddress = '0x0000000000000000000000000000000000000002';

    const updatedMessage = await config.repos.messageRepository.save(
      message,
    );

    Util.assertMessageAttributes(updatedMessage, message);
  });

  it('should pass when max gasPrice, gasLimit value is saved', async (): Promise<void> => {
    const message = new Message(
      messageHash,
      type,
      sourceStatus,
      targetStatus,
      gatewayAddress,
      intentHash,
      new BigNumber('999999999999999999999999999999999999999999999999999999999999999999999999999999'),
      new BigNumber('999999999999999999999999999999999999999999999999999999999999999999999999999999'),
      sourceDeclarationBlockNumber,
      createdAt,
      updatedAt,
    );

    const savedMessage = await config.repos.messageRepository.save(
      message,
    );
    Util.assertMessageAttributes(savedMessage, message);
  });

  it('should fail when gas price is higher than supported value', async (): Promise<void> => {
    const message = new Message(
      messageHash,
      type,
      sourceStatus,
      targetStatus,
      gatewayAddress,
      intentHash,
      new BigNumber('999999999999999999999999999999999999999999999999999999999999999999999999999999'),
      gasLimit,
      sourceDeclarationBlockNumber,
      createdAt,
      updatedAt,
    );

    try {
      await config.repos.messageRepository.save(message);
    } catch (error) {
      assertErrorMessages(error.errors, [
        'Validation on maximum gasPrice failed',
      ]);
    }
  });

  it('should fail when gas limit is higher than supported value', async (): Promise<void> => {
    const message = new Message(
      messageHash,
      type,
      sourceStatus,
      targetStatus,
      gatewayAddress,
      intentHash,
      gasPrice,
      new BigNumber('999999999999999999999999999999999999999999999999999999999999999999999999999999'),
      sourceDeclarationBlockNumber,
      createdAt,
      updatedAt,
    );

    try {
      await config.repos.messageRepository.save(message);
    } catch (error) {
      assertErrorMessages(error.errors, [
        'Validation on maximum gasLimit failed',
      ]);
    }
  });
});
