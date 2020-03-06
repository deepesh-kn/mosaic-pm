# Validator

The first version of the validator executable will connect all the components together and try to rotate the square wheel.
It will have a very simple logic in the first versions. We will call this as validator with Simple execution policy.
At the later stages we can have very complex execution policies that are very optimised and similated.

The first version will try to cover the following stories.
Each sprint will try to complete the multiple stores.

This document can be used to derive the tasks and tickets.

Please check the details of each component here

[Avatars](20200306-avatars.md)<br/>
[Subjective Models](20200306-subjective-models.md)<br/>
[Policies](20200306-policies.md)<br/>
[Services](20200306-services.md)<br/>
[Models](20200306-models.md)<br/>
[Handlers](20200306-handler.md)<br/>
[Subgraph-entities](20200306-subgraph-entities.md)<br/>

## Validator stories.

1. As a validator, I should be able to stake OST/MOST and WETH tokens to join a newly created metachain, so that my beneficiary address can get base token on the auxiliary chain.

1. As a validator, I should be able to stake OST/MOST and WETH tokens to join an existing running metachain, so that my beneficiary address can get base token on the auxiliary chain.

1. As a validator, I should be able to join the newly created metachain.

1. As a validator, I should be able to join an existing running metachain.

1. As a validator, I should be able to create the genesis file when the minimum number of validators join the metachain.

1. As a validator, I should be able to start a auxiliary chain by providing the genesis file.

1. As a validator, I should be able to connect the peers by providing the enodes that are published by the other validators.

1. As a validator, I should be able to confirm the opening of kernel on the metachain.

1. As a validator, I should be able to report the links/checkpoints in the OriginProtocore and SelfProtocore contracts.

1. As a validator, I should be able to register my vote for the reported link/checkpoint. I should only _ever_ vote for links I have calculated myself and do not violate slashing conditions with respect to the previously signed vote messages.

1. As a validator, I should be able to propose a new metablock in the core contract when the gas accumulation is equal (appox) to the desired gas target.

1. As a validator, I should be able to increment the kernel height, update the kernel hash, validator address and validator reputations, gasTarget and close the last opened kernel ( commit a checkpoint)

1. As a validator, I should be able to anchor the state root of the finalized block of origin chain on the metachain. (observeBlock)

1. As a validator, I should be able to register my vote for the proposed block in the core contract.

1. As a validator, I should be able to form a new committee for the precommitted metablock

1. As a validator, I should know exactly which validators should enter the newly formed committee so that I can add other validators in to the newly formed committee.

1. As a validator, I should be able to enter a new committee.

1. As a validator, I should be able to challenge the committee if amy validator has not entered the committee that was supposed to be the part of the committee.

1. As a validator and a member of a committee, I should be able to activate a committee.

1. As a validator and a member of a committee, I should be able to submit a sealed commit.

1. As a validator and a member of a committee, I should be able to reveal my position by providing the salt that was used in the sealed commit.

1. As a validator, I should know that the registered votes by all the validators are not violating the slashing conditions.

1. As a validator, I should be able to logout.

1. As a validator, I should only _ever_ vote for links I have calculated myself.

## Tasks:

### As a validator, I should be able to join the newly created metachain by staking the OST/MOST and the WETH tokens, so that my beneficiary address can get base token on the auxiliary chain.
- **Contracts**
    - *Functions:*
        - Consensus.joinDuringCreation
            ```
            joinDuringCreation(
                bytes32 _metachainId,
                address _withdrawalAddress
            )
            ```
        - Core.joinBeforeOpen
            ```
            core.joinBeforeOpen(msg.sender)
            ```
        - ValidatorSet.insertValidatorInternal
            ```
            ValidatorSet.insertValidatorInternal(
                address _validator,
                uint256 _beginHeight
            )
            ```
        - Reputation.stake
            ```
            reputation.stake(
                msg.sender,
                _withdrawalAddress
            )
            ```
        - ConsensusGateway.declareOpenKernel
            ```
            consensusGateway.declareOpenKernel(
                address(core),
                feeGasPrice,
                feeGasLimit
            )
            ```
    - *events:*
        - `ValidatorJoined` from the `Consensus` contract.
            ```
            ValidatorJoined(
                msg.sender,
                address(core),
                beginHeight,
                validatorReputation
            );
           ```
        - If the required validators have joined then 
            - `CoreLifetimeUpdated` from the `Consensus` contract.
                ```
                CoreLifetimeUpdated(
                    address(core),
                    uint256(CoreLifetime.genesis)
                );
                ```
            - `OpenedKernel` from the `Core` contract.
                ```
                OpenedKernel(
                    kernelHash,
                    kernelHeight,
                    metablockHash,
                    gasTarget
                );
                ```
            - `OpenKernelDeclared` from the `ConsensusGateway` contract.
                ```
                OpenKernelDeclared(
                    bytes32 openKernelHash,
                    uint256 openKernelHeight,
                    uint256 nonce,
                    uint256 feeGasPrice,
                    uint256 feeGasLimit,
                    address sender,
                    bytes32 messageHash
                )
                ```
            - `GenesisOriginObservationStored` from the `Core` contract.
                ```
                GenesisOriginObservationStored(genesisOriginObservationBlockNumber);
                ```
            - `CoreStatusUpdated` fomr the `Core` contract.
                ```
                CoreStatusUpdated(CoreStatus.opened);
                ```
- **Pre conditions:**
    - Metachain id should be available.
    - Withdrawal address should be available.
    - Validator has not already joined the core.
    - The number of validators joins the core must be less than the required validator count.
    - The lifetime status of core contract is`CoreStatus.created`.
    - The status of core contract is `CoreStatus.created`.
 
- **Post conditions:**
    - The status of the core is `CoreStatus.opened`
    - The `genesisOriginObservationBlockNumber` is avaialable when all the validators join the core.
    - The lifetime status of core contract is `CoreLifetime.genesis`.
    - The validator has joined the core.

- **Subgraph entities:**
    - JoinedValidator
    - UpdatedCoreLifetime
    - OpenedKernel
    - DeclaredOpenKernel
    - StoredGenesisOriginObservation
    - UpdatedCoreStatus
- **Handlers:**
    - JoinedValidatorHandler
    - UpdatedCoreLifetimeHandler
    - OpenedKernelHandler
    - DeclaredOpenKernelHandler
    - StoredGenesisOriginObservationHandler
    - UpdatedCoreStatusHandler
- **Models:**
    - Validator
    - Core
    - Kernel
    - OpenKernelIntent
    - Message
    - UntrustedEndpoint
    - Genesis
- **Respositories:**
    - ValidatorRespository
    - CoreRespository
    - OpenKernelIntentRespository
    - MessageRespository
    - UntrustedEndpointRespository
    - GenesisRepository
    - PublishEndpointModelRepositiry (subjective model repository)
- **Services:**
    - StartMetachainService
    - PublishEndpointService
- **Subjective models:**
    - PublishEndpointModel
- **Policy**
    - publishEndpointPolicy
- **Avatars:**
    - ValidatorAvatar
    
- **Tickets**
    - *Title*:  Create the subgraph entities [ To be updated in detail ]
        - *Descriptions*
          Create the following subgraph entities[ To be updated in detail ]
            - JoinedValidator
            - UpdatedCoreLifetime
            - OpenedKernel
            - DeclaredOpenKernel
            - StoredGenesisOriginObservation
            - UpdatedCoreStatus
        - *estimations*
        - *milestone*

### As a validator, I should be able to stake OST/MOST and WETH tokens to join an existing running metachain, so that my beneficiary address can get base token on the auxiliary chain.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone

### As a validator, I should be able to join the newly created metachain.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to join an existing running metachain.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to create the genesis file when the minimum number of validators join the metachain.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to start a auxiliary chain by providing the genesis file.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to connect the peers by providing the enodes that are published by the other validators.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to confirm the opening of kernel on the metachain.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to report the links/checkpoints in the OriginProtocore and SelfProtocore contracts.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to register my vote for the reported link/checkpoint. I should only _ever_ vote for links I have calculated myself and do not violate slashing conditions with respect to the previously signed vote messages.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to propose a new metablock in the core contract when the gas accumulation is equal (appox) to the desired gas target.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to increment the kernel height, update the kernel hash, validator address and validator reputations, gasTarget and close the last opened kernel ( commit a checkpoint)
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to anchor the state root of the finalized block of origin chain on the metachain. (observeBlock)
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to register my vote for the proposed block in the core contract.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to form a new committee for the precommitted metablock
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should know exactly which validators should enter the newly formed committee so that I can add other validators in to the newly formed committee.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to enter a new committee.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to challenge the committee if amy validator has not entered the committee that was supposed to be the part of the committee.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator and a member of a committee, I should be able to activate a committee.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator and a member of a committee, I should be able to submit a sealed commit.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator and a member of a committee, I should be able to reveal my position by providing the salt that was used in the sealed commit.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should know that the registered votes by all the validators are not violating the slashing conditions.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should be able to logout.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone


### As a validator, I should only _ever_ vote for links I have calculated myself.
- Contracts
    - functions:
    - events:
- Pre conditions:
- Post conditions:
- Subgraph entities:
- Handlers
- Models
- Respositories
- Services
- Subjective models
- Avatars
- Task details
- Tickets 
    - Title
        - Descriptions
        - estimations
        - milestone

