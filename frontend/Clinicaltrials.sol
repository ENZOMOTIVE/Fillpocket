// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ClinicalTrialsPlatform is Ownable {
    using Counters for Counters.Counter;

    IERC20 public rewardToken;
    Counters.Counter private _trialIds;

    struct ClinicalTrial {
        uint256 id;
        address creator;
        string name;
        string description;
        uint256 reward;
        bool isActive;
        mapping(address => bool) participants;
        mapping(address => string) reviews;
    }

    mapping(uint256 => ClinicalTrial) public trials;
    mapping(address => uint256) public userRewards;

    // Array to keep track of all trial IDs
    uint256[] private allTrialIds;

    event TrialCreated(uint256 indexed trialId, address indexed creator, string name, uint256 reward);
    event UserParticipated(uint256 indexed trialId, address indexed user);
    event ReviewSubmitted(uint256 indexed trialId, address indexed user, string review);
    event RewardDistributed(address indexed user, uint256 amount);
    event TrialStatusUpdated(uint256 indexed trialId, bool isActive);

    constructor(address _rewardToken) Ownable(msg.sender) {
        rewardToken = IERC20(_rewardToken);
    }

    function createTrial(string memory _name, string memory _description, uint256 _reward) external {
        require(_reward > 0, "Reward must be greater than 0");
        require(rewardToken.balanceOf(msg.sender) >= _reward, "Insufficient reward token balance");

        _trialIds.increment();
        uint256 newTrialId = _trialIds.current();

        ClinicalTrial storage newTrial = trials[newTrialId];
        newTrial.id = newTrialId;
        newTrial.creator = msg.sender;
        newTrial.name = _name;
        newTrial.description = _description;
        newTrial.reward = _reward;
        newTrial.isActive = true;

        // Add to array of trial IDs
        allTrialIds.push(newTrialId);

        require(rewardToken.transferFrom(msg.sender, address(this), _reward), "Failed to transfer reward tokens");

        emit TrialCreated(newTrialId, msg.sender, _name, _reward);
    }

    function participateInTrial(uint256 _trialId) external {
        ClinicalTrial storage trial = trials[_trialId];
        require(trial.isActive, "Trial is not active");
        require(!trial.participants[msg.sender], "User has already participated");

        trial.participants[msg.sender] = true;
        userRewards[msg.sender] += trial.reward;

        emit UserParticipated(_trialId, msg.sender);
    }

    function submitReview(uint256 _trialId, string memory _review) external {
        ClinicalTrial storage trial = trials[_trialId];
        require(trial.participants[msg.sender], "User has not participated in this trial");
        require(bytes(trial.reviews[msg.sender]).length == 0, "User has already submitted a review");

        trial.reviews[msg.sender] = _review;

        emit ReviewSubmitted(_trialId, msg.sender, _review);
    }

    function claimRewards() external {
        uint256 rewardAmount = userRewards[msg.sender];
        require(rewardAmount > 0, "No rewards to claim");

        userRewards[msg.sender] = 0;
        require(rewardToken.transfer(msg.sender, rewardAmount), "Failed to transfer rewards");

        emit RewardDistributed(msg.sender, rewardAmount);
    }

    // New function to get all trial IDs
    function getAllTrialIds() external view returns (uint256[] memory) {
        return allTrialIds;
    }

    // New function to get active trial IDs
    function getActiveTrialIds() external view returns (uint256[] memory) {
        uint256[] memory activeIds = new uint256[](allTrialIds.length);
        uint256 activeCount = 0;

        for (uint256 i = 0; i < allTrialIds.length; i++) {
            if (trials[allTrialIds[i]].isActive) {
                activeIds[activeCount] = allTrialIds[i];
                activeCount++;
            }
        }

        // Resize array to actual count of active trials
        uint256[] memory result = new uint256[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeIds[i];
        }

        return result;
    }

    function getTrialDetails(uint256 _trialId) external view returns (
        uint256 id,
        address creator,
        string memory name,
        string memory description,
        uint256 reward,
        bool isActive
    ) {
        ClinicalTrial storage trial = trials[_trialId];
        return (trial.id, trial.creator, trial.name, trial.description, trial.reward, trial.isActive);
    }

    function hasParticipated(uint256 _trialId, address _user) external view returns (bool) {
        return trials[_trialId].participants[_user];
    }

    function getReview(uint256 _trialId, address _user) external view returns (string memory) {
        return trials[_trialId].reviews[_user];
    }

    function getUserRewards(address _user) external view returns (uint256) {
        return userRewards[_user];
    }

    // New function to set trial status
    function setTrialStatus(uint256 _trialId, bool _isActive) external {
        require(msg.sender == trials[_trialId].creator || msg.sender == owner(), "Not authorized");
        trials[_trialId].isActive = _isActive;
        emit TrialStatusUpdated(_trialId, _isActive);
    }

    function setRewardToken(address _newRewardToken) external onlyOwner {
        rewardToken = IERC20(_newRewardToken);
    }

    function withdrawUnusedRewards(uint256 _amount) external onlyOwner {
        require(rewardToken.transfer(owner(), _amount), "Failed to withdraw unused rewards");
    }

    // New function to get total number of trials
    function getTotalTrials() external view returns (uint256) {
        return _trialIds.current();
    }
}