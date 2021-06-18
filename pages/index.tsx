import React, { Fragment, useState } from 'react';
import Head from 'next/head';
import {
  Alert,
  AlertIcon,
  Box,
  CloseButton,
  Heading,
  Text,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { Account, AdAccount, MessageProps } from '../types';
import PostType from '../components/PostType';

const PostAccount = dynamic(() => import('../components/PostAccount'), {
  ssr: false,
});

function Home() {
  const [account, setAccount] = useState<Account>();
  const [adAccount, setAdAccount] = useState<AdAccount>();
  const [message, setMessage] = useState<MessageProps>();

  return (
    <Fragment>
      <Head>
        <title>Post Video Carousel to Pages</title>
      </Head>
      <Box maxW="1200px" margin="auto" px={['5', '5', '5', '5']}>
        <Box py="5">
          <Heading size="lg">Post Video Carousel to Pages</Heading>
          <Text color="gray.500">
            If you don't have an account please go to settings and configure it.
          </Text>
        </Box>
        {!!message && (
          <Alert status={message.status} variant="left-accent">
            <AlertIcon />
            {message.text}
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => setMessage(null)}
            />
          </Alert>
        )}
        <PostAccount
          onAccountChange={(acc) => setAccount(acc)}
          onAdAccountChange={(adacc) => setAdAccount(adacc)}
        />
        {account && adAccount && (
          <PostType
            adAccountId={adAccount.id}
            account={account}
            setMessage={setMessage}
          />
        )}
      </Box>
    </Fragment>
  );
}

export default Home;
