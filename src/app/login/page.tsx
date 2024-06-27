'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { useStore } from '../store';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';

import ChallengeToken from '../types/ChallengeToken';

import './styles.css'

function Login() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const router = useRouter();
  const { signMessage } = useSignMessage();

  const [displayError, setDisplayError] = useState<string | false>(false);

  const { setChallengeToken } = useStore();

  useEffect(() => {
    if (error)
      setDisplayError(error?.message);
  }, [error]);

  useEffect(() => {
    if (account.address) {
      fetch(`/api/authenticator/challenge?address=${account.address}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data: any) => {
          console.log(data)

          const { error, data: unsignedChallenge } = data;
          const { challenge, expiry }: { challenge: string, expiry: number } = unsignedChallenge;

          if (error) {
            setDisplayError(error.message);
            return;
          }

          signMessage({
            message: `${challenge}:${expiry}`
          }, {
            onSuccess: (data: `0x${string}`) => {
              setChallengeToken({
                address: account.address,
                challenge,
                expiry,
                signature: data
              } as ChallengeToken);

              router.push('/');
            },
            onError: () => setDisplayError('Error signing message.')
          })
        })
        .catch((error) => setDisplayError(error.message));
    }
  }, [account?.address]);

  return (
    <>
      <Snackbar
        open={displayError ? true : false}
        autoHideDuration={6000}
        onClose={() => setDisplayError(false)}
        message={`Error: ${error?.message}`}
      />
      <Container sx={{ my: 4, }} fixed>
        <Grid container spacing={2} sx={{ mx: 3 }}>
          <Grid item xs={12}>
            <Typography variant="h1">Login</Typography>
            <Typography variant="h2">via Web3 provider of your choice</Typography>
          </Grid>
          {typeof (account?.address) == 'undefined' ? connectors.map((connector) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={connector.uid}>
              <Card id='provider' onClick={() => connect({ connector })}>
                <CardContent>
                  <img height='64px' src={`/icons/${connector.id}.png`} alt={connector.name} />
                  <Typography variant="body1">{connector.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )) : <Typography variant="body1" sx={{ mx: 5 }}>
            Please, sign the message to continue.
          </Typography>}
        </Grid>
      </Container>
    </>
  )
}

export default Login
