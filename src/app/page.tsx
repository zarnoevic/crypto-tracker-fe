'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Navbar from './components/Navbar';
import Tokens from './components/Tokens';
import NFTs from './components/NFTs';

function App() {
  const router = useRouter();

  const [tabValue, setTabValue] = useState('tokens');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => setTabValue(newValue);

  return (
    <>
      <Navbar />
      <Container sx={{ my: 4, }}>
        <Typography variant="h2" >
          Dashboard
        </Typography>
        <Button onClick={() => router.push('/trackProject')}>Track New Project</Button>
        <Tabs
          value={tabValue}
          onChange={handleChange}
        >
          <Tab
            value="tokens"
            label="Tokens"
          />
          <Tab value="nfts" label="NFTs" />
        </Tabs>
        {tabValue === 'tokens' && <Tokens />}
        {tabValue === 'nfts' && <NFTs />}
      </Container>
    </>
  )
}

export default App
