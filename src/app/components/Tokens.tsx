'use client'

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useStore } from '../store';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';

import StarIcon from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';

interface Token {
    logo: string;
    name: string;
    symbol: string;
    price: string;
    bookmarked?: boolean;
}

function Tokens() {
    const account = useAccount();

    const [tokens, setTokens] = useState<Token[]>([]);
    const [toastMessage, setToastMessage] = useState<false | string>(false);
    const { challengeToken } = useStore();

    useEffect(() => {
        if (account.address)
            fetch('/api/projects/get', {
                method: 'POST',
                body: JSON.stringify({
                    address: account.address,
                    type: 'token',
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
            <Box mx={{ my: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Logo</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Bookmarked</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tokens && tokens.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <img src={row.logo} alt={row.name} width='32px' />
                                    </TableCell>
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.symbol}</TableCell>
                                    <TableCell>{row.price} USD</TableCell>
                                    <TableCell>
                                        {row.bookmarked ? <StarIcon /> : <StarBorder />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default Tokens;
