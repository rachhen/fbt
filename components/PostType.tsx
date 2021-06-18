import React, { FC } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Heading,
} from '@chakra-ui/react';

import { Account, MessageProps } from '../types';
import PostVideoURL from './PostVideoURL';
import PostVideoRecent from './PostVideoRecent';
import PostVideoUpload from './PostVideoUpload';

export type PostTypeProps = {
  adAccountId: string;
  account: Account;
  setMessage?: (props: MessageProps) => void;
};

const PostType: FC<PostTypeProps> = (props) => {
  return (
    <Box pt="5">
      <Heading size="md">Create Post Data</Heading>
      <Tabs variant="enclosed" pt="2">
        <TabList>
          <Tab _focus={{ outline: 'none' }}>URL</Tab>
          <Tab _focus={{ outline: 'none' }}>Upload</Tab>
          <Tab _focus={{ outline: 'none' }}>Recent Uploads</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px="0">
            <PostVideoURL {...props} />
          </TabPanel>
          <TabPanel px="0">
            <PostVideoUpload {...props} />
          </TabPanel>
          <TabPanel px="0">
            <PostVideoRecent {...props} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PostType;
