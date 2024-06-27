export default interface ChallengeToken {
    signature?: `0x${string}`;
    address: string;
    challenge: string;
    expiry: number;
}