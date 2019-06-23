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

/* eslint-disable class-methods-use-this */

import {
  DataTypes, Model, InitOptions, Op,
} from 'sequelize';

export class GatewayModel extends Model {}

/**
 * To be used for calling any methods which would change states of record(s) in Database.
 */
export interface GatewayAttributes {
  gatewayAddress: string;
  chainId: number;
  gatewayType: string;
  remoteGatewayAddress: string;
  tokenAddress: string;
  anchorAddress: string;
  bounty: number;
  activation: boolean;
  lastRemoteGatewayProvenBlockHeight?: number;
}

/**
 * Repository would always return database rows after typecasting to this.
 */
export interface Gateway extends GatewayAttributes{
  createdAt: Date;
  updatedAt: Date;
}

export class GatewayConstant {
  /* Origin gateway type. */
  public static originGatewayType: string = 'origin';

  /* Auxiliary gateway type. */
  public static auxiliaryGatewayType: string = 'auxiliary';
}

export class GatewayRepository {
  /* Public Functions */

  public constructor(initOptions: InitOptions) {
    GatewayModel.init(
      {
        gatewayAddress: {
          type: DataTypes.STRING,
          primaryKey: true,
          validate: {
            isAlphanumeric: true,
            len: [42, 42],
          },
        },
        chainId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        gatewayType: {
          type: DataTypes.ENUM({
            values: [GatewayConstant.originGatewayType, GatewayConstant.auxiliaryGatewayType],
          }),
          allowNull: false,
        },
        remoteGatewayAddress: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isAlphanumeric: true,
            len: [42, 42],
          },
        },
        tokenAddress: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isAlphanumeric: true,
            len: [42, 42],
          },
        },
        anchorAddress: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isAlphanumeric: true,
            len: [42, 42],
          },
        },
        bounty: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        activation: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        lastRemoteGatewayProvenBlockHeight: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 0,
          },
        },
      },
      {
        ...initOptions,
        modelName: 'gateway',
        tableName: 'gateway',
      },
    );
  }

  /**
   * Creates a gateway model in the repository and syncs with database.
   * @param {GatewayAttributes} gatewayAttributes
   * @return {Promise<Gateway>}
   */
  public async create(gatewayAttributes: GatewayAttributes): Promise<Gateway> {
    try {
      return await GatewayModel.create(gatewayAttributes) as Gateway;
    } catch (e) {
      const errorContext = {
        attributes: gatewayAttributes,
        reason: e.message,
      };
      return Promise.reject(`Failed to create a gateway: ${JSON.stringify(errorContext)}`);
    }
  }

  /**
   * Fetches gateway data from database.
   * @param {string} gatewayAddress
   * @return {Promise<Gateway | null>}
   */
  public async get(gatewayAddress: string): Promise<Gateway | null> {
    const gateway = await GatewayModel.findOne({
      where: {
        gatewayAddress,
      },
    });

    if (gateway === null) {
      return null;
    }

    return gateway as Gateway;
  }

  /**
   * Updates gateway data in database and does not return the updated state.
   * @param {GatewayAttributes} gatewayAttributes
   * @return {Promise<Array<Number>>}
   */
  public async update(gatewayAttributes: GatewayAttributes): Promise<number[]> {
    return await GatewayModel.update(gatewayAttributes, {
      where: {
        gatewayAddress: {
          [Op.eq]: gatewayAttributes.gatewayAddress,
        },
      },
    });
  }
}
