'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import ChallengeToken from '../types/ChallengeToken';

import { useStore } from '../store';

function Navbar({ backButtonTarget }: { backButtonTarget?: string }) {
    const account = useAccount();
    const { connectors, connect, status, error } = useConnect();
    const { disconnect } = useDisconnect();
    const router = useRouter();

    const { challengeToken, setChallengeToken } = useStore();

    // TODO: handle network switch in here
    // TODO: store challenge token in local storage? via zustand, if yes, check address against the token too
    useEffect(() => {
        if (!account.address || challengeToken.expiry < Date.now() || !challengeToken.signature) {
            router.push('/login');
        }
    }, [account.address, challengeToken]);

    return (
        <AppBar position="static">
            <Toolbar>
                {backButtonTarget && <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => router.push(backButtonTarget)}
                >
                    <KeyboardBackspaceIcon />
                </IconButton>}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Crypto Tracker
                </Typography>
                <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                    {
                        account.status === 'connected' ? `Connected: ${account.addresses[0]}` : null
                    }
                </Typography>
                <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                    {
                        account.status === 'connected' ? `ChainId: ${account.chainId}` : null
                    }
                </Typography>
                <Button color="inherit" onClick={() => {
                    setChallengeToken({} as ChallengeToken);
                    disconnect();
                }}>
                    Disconnect
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;
