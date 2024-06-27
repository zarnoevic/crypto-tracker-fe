'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store';

import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';

import Navbar from '../components/Navbar';

import tokenList from '../data/tokens.json';
import nftList from '../data/nfts.json';

import { isAddress } from 'viem';

const _tokenList = tokenList.map((token) => ({
    label: `${token.name} (${token.symbol})`,
    value: token.address
}));

const _nftList = nftList.map((nft) => ({
    label: nft.name,
    value: nft.address
}));

function TrackProject() {
    const router = useRouter();

    const [toastMessage, setToastMessage] = useState<false | string>(false);

    const [tabValue, setTabValue] = useState<'token' | 'nft'>('token');
    const [bookmark, setBookmark] = useState<boolean>(false);

    const [tokenSelectorValue, setTokenSelectorValue] = useState<{ value: string, label: string } | undefined>(undefined);
    const [tokenAddress, setTokenAddress] = useState<string>('');

    const [nftSelectorValue, setNftSelectorValue] = useState<{ value: string, label: string } | undefined>(undefined);
    const [nftAddress, setNftAddress] = useState<string>('');

    const handleTabChange = (event: React.SyntheticEvent, newValue: 'token' | 'nft') => setTabValue(newValue);
    const handleBookmarkChange = (event: React.ChangeEvent<HTMLInputElement>) => setBookmark((event.target as HTMLInputElement).value as unknown as boolean);

    const { challengeToken } = useStore();

    const track = () => {
        if (tabValue === 'token') {
            if (!isAddress(tokenAddress)) {
                setToastMessage('Error: Invalid token address provided!');
                return;
            }
        } else if (tabValue === 'nft') {
            if (!isAddress(nftAddress)) {
                setToastMessage('Error: Invalid NFt address provided!');
                return;
            }
        }

        fetch('/api/projects', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: tabValue,
                address: tabValue === 'nft' ? nftAddress : tokenAddress,
                bookmark,
                token: challengeToken
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setToastMessage(`Error: ${data.message}`);
                    return;
                }

                setToastMessage(data.message);

                setTimeout(() => router.push('/'), 1000);
            })
            .catch((error: any) => setToastMessage(`Error: ${error.message}`));
    }

    return (
        <>
            <Snackbar
                open={toastMessage ? true : false}
                autoHideDuration={6000}
                onClose={() => setToastMessage(false)}
                message={toastMessage}
            />
            <Navbar backButtonTarget='/' />
            <Container sx={{ my: 4, }}>
                <Typography variant='h2' >
                    Track Project
                </Typography>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                >
                    <Tab
                        value="token"
                        label="Token"
                    />
                    <Tab value="nft" label="NFT" />
                </Tabs>
                {tabValue === 'token' && <Box sx={{ my: 2 }}>
                    <Box sx={{ my: 2 }}>
                        <Typography variant='body1' sx={{ my: 2 }}>
                            Search predefined tokens
                        </Typography>
                        <Autocomplete
                            disablePortal
                            options={_tokenList}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label='Address' />}
                            onChange={(event, value) => {
                                setTokenSelectorValue(value as any as undefined | { label: string, value: 'string' });
                                if (value?.value) setTokenAddress(value?.value || '');
                            }}
                            value={tokenSelectorValue}
                        />
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Typography variant='body1' sx={{ my: 2 }}>
                            Or enter token address
                        </Typography>
                        <TextField
                            label='Address'
                            sx={{ width: 300 }}
                            value={tokenAddress}
                            onChange={(event) => {
                                setTokenAddress(event.target.value);
                                setTokenSelectorValue(undefined);
                            }}
                        />
                    </Box>
                </Box>}
                {tabValue === 'nft' &&
                    <Box>
                        <Box sx={{ my: 2 }}>
                            <Typography variant='body1' sx={{ my: 2 }}>
                                Search predefined NFTs
                            </Typography>
                            <Autocomplete
                                disablePortal
                                options={_nftList}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label='Address' />}
                                onChange={(event, value) => {
                                    setNftSelectorValue(value as any as undefined | { label: string, value: 'string' });
                                    if (value?.value) setNftAddress(value?.value || '');
                                }}
                                value={nftSelectorValue}
                            />
                        </Box>
                        <Box sx={{ my: 2 }}>
                            <Typography variant='body1' sx={{ my: 2 }}>
                                Or enter the NFT address:
                            </Typography>
                            <TextField
                                label='Address'
                                sx={{ width: 300 }}
                                value={nftAddress}
                                onChange={(event) => {
                                    setNftAddress(event.target.value);
                                    setNftSelectorValue(undefined);
                                }}
                            />
                        </Box>
                    </Box>}
                <Box sx={{ my: 2 }}>
                    <FormControl>
                        <Typography variant='body1'>Bookmark this project?</Typography>
                        <RadioGroup
                            value={bookmark}
                            onChange={handleBookmarkChange}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                            <FormControlLabel value={false} control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Box>
                    <Button onClick={track}>Track</Button>
                </Box>
            </Container>
        </>
    )
}

export default TrackProject;
