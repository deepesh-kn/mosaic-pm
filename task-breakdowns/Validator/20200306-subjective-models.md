# Subjective models
**Please note that this is a draft version**

This are the models that stores the data that can be used as a possible candidates of the actual ethereum transactions. 
The validator executable is not reactive as compared to what we had in M0-facilitator. The validator will not submit any ethereum transaction as soon as it sees any event, instead the validator executable will store the data in the subjective models. This gives a chance to make sure that all the preconditions required for calling any function of the contracts are achieved, and the storage state is already finalized. 
The policies will decided how the avatar services will react to the data stored in the subjective models. More detials on [policies](20200306-policies.md)

**Following are the proposals of the subjective models.**
1. **BlockHistoryModel**
    - blockHash
    - blockNumber
    - parentBlockHash
    - isLeaf
    - isUncleHash
    - stateRoot
    - transactionRoot
    - receiptRoot
1. **CommitteeCooldownModel**
    - committeeGA
    - status
1. **CommitteeActivateModel**
    - committeeGA
    - activationBlockHeight
    - status
1. **CommitteeSubmitSealedCommitModel**
    - committeeGA
    - position
    - salt
    - status
1. **CommitteeChallengeModel**
    - committeeGA
    - excludedMember
    - status
1. **CommitteeCloseCommitPhaseModel**
    - committeeGA
    - commitTimeOutBlockHeight
    - status
1. **CommitteeRevealCommitModel**
    - committeeGA
    - position
    - salt
    - status
1. **CommitMetablockModel**
    - metblockHash
    - status
1. **CommitCheckpointModel**
    - KernelHash
    - CoopenedBlockNumber
    - blockHash
    - status
1. **ObserveBlockModel**
    - voteMessageHash
    - blockheight
    - blockhash
    - status
1. **FormCommitteeModel**
    - metablockHash
    - status
1. **EnterCommitteeModel**
    - metablockHash
    - status
1. **ConfirmOpenKernelModel**
    - messageHash
    - blocknumber
    - blockhash
    - status
1. **ProposeMetablockModel**
    - voteMessageHash
    - status
1. **RegisterVoteModel**
    - voteMessage
    - voteCount
    - status
1. **ProposeLinkModel**
    - voteMessageHash
    - status

**The value of status can be**
- PROPOSED
- COMMITTED
- REJECTED
- NO_ACTION_REQUIRED