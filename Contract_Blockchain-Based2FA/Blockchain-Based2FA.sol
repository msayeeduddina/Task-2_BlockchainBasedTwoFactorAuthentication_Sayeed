// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BlockchainBased2FA is Ownable, ReentrancyGuard {

    using SafeMath for uint256;

    //Uint
    uint256 private otpValidDuration;

    //Struct
    struct User {
        string username;
        address publicKey;
        bytes32 otpSeed;
        uint256 lastUsedTimeWindow;
    }

    //Mapping
    mapping(address => User) private users;

    //Event
    event UserRegistered(string indexed username, address indexed publicKey, bytes32 otpSeed);
    event UserAuthenticated(address indexed publicKey, uint256 timestamp);

    //Constructor
    constructor(uint256 initialOtpValidDuration) Ownable() {
        require(initialOtpValidDuration > 0, "Duration must be greater than zero");
        otpValidDuration = initialOtpValidDuration;
    }

    //User
    function registerUser(string memory username, address publicKey, bytes32 otpSeed) external nonReentrant {
        require(bytes(username).length > 0, "Username cannot be empty");
        require(publicKey != address(0), "Invalid public key");
        require(users[publicKey].publicKey == address(0), "User already registered");
        users[publicKey] = User({
            username: username,
            publicKey: publicKey,
            otpSeed: otpSeed,
            lastUsedTimeWindow: 0
        });
        emit UserRegistered(username, publicKey, otpSeed);
    }

    function authenticate(address user, uint256 otp) external nonReentrant returns(bool) {
        require(users[user].publicKey != address(0), "User not registered");
        uint256 currentTimeWindow = block.timestamp.div(otpValidDuration);
        require(currentTimeWindow > users[user].lastUsedTimeWindow, "OTP already used in this time window");
        uint256 generatedOTP = generateOTP(user);
        require(otp == generatedOTP, "Invalid OTP");
        users[user].lastUsedTimeWindow = currentTimeWindow;
        emit UserAuthenticated(user, block.timestamp);
        return true;
    }

    //View
    function generateOTP(address user) public view returns(uint256) {
        require(users[user].publicKey != address(0), "User not registered");
        uint256 timeWindow = block.timestamp.div(otpValidDuration);
        require(timeWindow > users[user].lastUsedTimeWindow, "OTP already generated for this time window");
        bytes32 otpHash = keccak256(abi.encodePacked(users[user].otpSeed, timeWindow));
        return uint256(otpHash) % 1000000;
    }

    //Admin
    function setOtpValidDuration(uint256 duration) external onlyOwner {
        require(duration > 0, "Duration must be greater than zero");
        otpValidDuration = duration;
    }

}