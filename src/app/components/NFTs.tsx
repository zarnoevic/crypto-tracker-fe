import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useStore } from '../store';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';

import StarIcon from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';

interface Token {
    logo: string;
    name: string;
    symbol: string;
    avgPrice: string;
    floorPrice: string;
    bookmarked?: boolean;
}

function NFTs() {
    const account = useAccount();

    const { challengeToken } = useStore();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [toastMessage, setToastMessage] = useState<string | false>(false);

    useEffect(() => {
        if (account.address)
            fetch('/api/projects/get', {
                method: 'POST',
                body: JSON.stringify({
                    address: account.address,
                    type: 'nft',
                    token: challengeToken
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data: any) => {
                    setTokens(data.data);
                })
                .catch((error) => setToastMessage(`Error: ${error.message}`));
    }, [account.address]);

    return (
        <>
            <Snackbar
                open={toastMessage ? true : false}
                autoHideDuration={6000}
                onClose={() => setToastMessage(false)}
                message={toastMessage}
            />
            <Grid container spacing={2} sx={{ my: 2 }}>
                {tokens && tokens.map((token, k) => (
                    <Grid item xs={12} sm={6} md={4} key={k}>
                        <Card>
                            <CardMedia
                                component='img'
                                height='194'
                                image={token.logo}
                                alt={token.name}
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {
                                        token.bookmarked ?
                                            <StarIcon color='primary' />
                                            :
                                            <StarBorder color='primary' />
                                    } {token.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {token.symbol}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Average Price: {token.avgPrice} USD
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Lowest Price: {token.floorPrice} USD
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default NFTs;
