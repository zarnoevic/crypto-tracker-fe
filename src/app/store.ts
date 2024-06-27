import { create } from 'zustand';
import ChallengeToken from './types/ChallengeToken';

export type Store = {
    challengeToken: ChallengeToken;
    setChallengeToken: (challengeToken: ChallengeToken) => void;
};

export const useStore = create<Store>()((set) => ({
    challengeToken: {} as ChallengeToken,
    setChallengeToken: (challengeToken: ChallengeToken) => set({ challengeToken }),
}));