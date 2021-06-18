import React, { Fragment } from 'react';
import Head from 'next/head';
import { Box, Divider } from '@chakra-ui/layout';
import dynamic from 'next/dynamic';

import SetupCloudinary from '../components/SetupCloudinary';

const AddFacebookProfile = dynamic(
  () => import('../components/AddFacebookProfile'),
  { ssr: false }
);

function Settings() {
  return (
    <Fragment>
      <Head>
        <title>Settings</title>
      </Head>
      <Box maxW="1200px" margin="auto" mb="10">
        <AddFacebookProfile />
        <Divider my="5" />
        <SetupCloudinary />
      </Box>
    </Fragment>
  );
}

export default Settings;
