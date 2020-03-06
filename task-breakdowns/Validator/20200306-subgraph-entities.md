# Subgraphs Enitities
**Please note that this is a draft version**

- ProxyCreation(Proxy proxy)
- LinkProposed(
    parentVoteMessageHash,
    targetBlockHash,
    targetBlockNumber,
    sourceOriginObservation,
    sourceKernelHash,
    sourceDynasty,
    sourceAccumulatedGas,
    sourceCommitteeLock
    );

- OpenedKernel(kernelHeight, kernelHash);
- RegisteredVote(
    voteMessageHash,
    height,
    r,
    s,
    v
    );
- VotedLinkUp(
    voteMessageHash,
    targetFinalisationStatus
    );

- ProvenGateway(remoteGateway,blockNumber);
- DeclaredDepositIntent(
    amount,
    nonce,
    beneficiary,
    feeGasPrice,
    feeGasLimit,
    depositor,
    valueToken,
    messageHash
    );
- ConfirmedWithdrawIntent(messageHash);

- DeclaredWithdrawIntent(
    amount,
    nonce,
    beneficiary,
    feeGasPrice,
    feeGasLimit,
    withdrawer,
    utilityToken,
    messageHash
    );

- ConfirmedDepositIntent(messageHash);
- CreatedUtilityToken(valueToken, utilityToken);
- ProposedMetablock(proposal);
- UpdatedCoreStatus(status);
- StoredGenesisOriginObservation(genesisOriginObservationBlockNumber);

- PublishedEndpoint(
    metachainId,
    core,
    validator,
    service,
    endpoint
    );

- LoggedOutValidator(
    validator,
    endHeight,
    withdrawalBlockHeight
    );

- CreatedCore(
    core,
    metachainId,
    minValidators,
    maxValidators,
    gasTarget
    );

- JoinedValidator(
    validator,
    core,
    beginHeight,
    reputation
    );

- UpdatedCoreLifetime(
    core,
    coreLifetime
    );

- PrecommittedMetablock(
    metablockHash,
    metachainId,
    metablockHeight,
    roundMetablockNumber
    );

- FormedMetablockCommittee(
    committee,
    metablockHash,
    metachainId,
    formationHeight,
    size
    );

- DecidedMetablockCommittee(
    committee,
    metablockHash,
    metachainId,
    size,
    decision
    );

- CommittedMetablock(
    kernelHash,
    core,
    metachainId,
    metablockHash
    );

- UpdatedCommitteeStatus(status);
- EnteredCommitteeMember(member);
- EjectedCommitteeMember(member);
- CommittedMember(member);
- RevealedMember(member, position);

- CreateMetachaind(
    metachainId,
    anchor,
    mosaicVersion,
    consensusGateway
    );
- AvailableStateRoot(blockNumber, stateRoot);

- OpenedKernel(
    kernelHash,
    kernelHeight,
    metablockHash,
    gasTarget
  )
- CoopenedKernel(
    kernelHash,
    kernelHeight
  )

- DeclaredOpenKernel(
    bytes32 openKernelHash,
    uint256 openKernelHeight,
    uint256 nonce,
    uint256 feeGasPrice,
    uint256 feeGasLimit,
    address sender,
    bytes32 messageHash
    )
- ConfirmedOpenKernel(
    bytes32 kernelHash,
    bytes32 messageHash
    )

- ProtocoreSetup(
        address protocore,
        bytes32 metachainId,
        bytes32 domainSeparator,
        uint256 openMetablockHeight
    )
- ProvenRemoteGateway.
    - Already implemented
- DeclaredDepositIntent(
    uint256 amount,
    uint256 nonce,
    address beneficiary,
    uint256 feeGasPrice,
    uint256 feeGasLimit,
    address depositor,
    bytes32 messageHash
    )
- ConfirmedDepositIntent(bytes32 messageHash)
- DeclaredWithdrawIntent(
    uint256 amount,
    uint256 nonce,
    address beneficiary,
    uint256 feeGasPrice,
    uint256 feeGasLimit,
    address withdrawer,
    bytes32 messageHash
    )
- ConfirmedWithdrawIntent(bytes32 messageHash)
- DepositedGenesis(
    uint256 amount,
    uint256 nonce,
    address beneficiary,
    uint256 feeGasPrice,
    uint256 feeGasLimit,
    address depositor,
    bytes32 messageHash
    )

Unimplemented:

- UpdatedLinkTargetFinalizationStatus. TODO: Discuss if this is needed?
