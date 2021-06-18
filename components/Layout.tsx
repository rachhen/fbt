import React, { FC } from 'react';
import { Flex, Box } from '@chakra-ui/react';

import Footer from './Footer';
import Header from './Header';

const Layout: FC = ({ children }) => {
  return (
    <Box minH="100vh">
      <Header />
      {children}
      <Footer />
    </Box>
  );
};

export default Layout;
