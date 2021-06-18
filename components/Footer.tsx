import React from 'react';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

function Footer() {
  return (
    <Flex
      position="absolute"
      align="center"
      justify="center"
      bottom={0}
      w="100%"
      py="3"
    >
      <Text color={useColorModeValue('gray.400', 'gray.500')} fontSize="sm">
        {' '}
        © {new Date().getFullYear()} By Woufu 🙀{' '}
      </Text>
    </Flex>
  );
}

export default Footer;
