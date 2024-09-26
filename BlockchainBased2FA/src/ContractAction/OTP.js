import { ethers } from "ethers";
import { contractABI, contractAddress } from "./ContractDependency.js";

export const setRegisterUser = async (username, publicKey, otpSeedString) => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const otpSeed = ethers.utils.formatBytes32String(otpSeedString);
        const tx = await contract.registerUser(username, publicKey, otpSeed);
        await tx.wait();
        console.log("User registered:", tx.hash);
        alert("User registered successfully!" + tx.hash);
    } catch (error) {
        console.error("Error registering user:", error.message || error);
    }
};

export const setAuthenticateUser = async (user, otp) => {
    console.log("Authenticating user:", user);
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const isAuthenticated = await contract.authenticate(user, otp);
        console.log("User authenticated:", isAuthenticated);
        if (isAuthenticated) {
            alert("User Authenticated successfully!" + isAuthenticated.hash);
        }
        return isAuthenticated;
    } catch (error) {
        console.error("Error authenticating user:", error);
    }
};

export const getGenerateOTP = async (user) => {
    console.log("Generating OTP for user:", user);
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const otp = await contract.generateOTP(user);
        console.log("Generated OTP:", otp);
        return otp;
    } catch (error) {
        console.error("Error generating OTP:", error);
    }
};