import React from 'react';
import { useViewportScroll } from 'framer-motion';
import NextLink from 'next/link';
import { FaMoon, FaSun } from 'react-icons/fa';
import Image from 'next/image';
import {
  chakra,
  HStack,
  Flex,
  IconButton,
  useColorModeValue,
  useColorMode,
  Box,
} from '@chakra-ui/react';

export default function Header() {
  const { toggleColorMode: toggleMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const bg = useColorModeValue('white', 'gray.800');
  const ref = React.useRef<HTMLElement>();
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {};

  const { scrollY } = useViewportScroll();

  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()));
  }, [scrollY]);

  return (
    <React.Fragment>
      <chakra.header
        ref={ref}
        shadow={y > height ? 'sm' : undefined}
        transition="box-shadow 0.2s"
        bg={bg}
        w="full"
        overflowY="hidden"
        borderBottomWidth={2}
        borderBottomColor={useColorModeValue('gray.200', 'gray.900')}
      >
        <chakra.div h="4.5rem" mx="auto" maxW="1200px">
          <Flex
            w="full"
            h="full"
            px="6"
            alignItems="center"
            justifyContent="space-between"
          >
            <NextLink href="/">
              <chakra.a pt="2" _hover={{ cursor: 'pointer' }}>
                <Image
                  src="/logo.png"
                  width="50px"
                  height="50px"
                  objectFit="cover"
                />
              </chakra.a>
            </NextLink>

            <HStack>
              <NextLink href="/" passHref>
                <chakra.a
                  fontSize="sm"
                  fontWeight="semibold"
                  color={useColorModeValue('brand.500', 'brand.200')}
                  cursor="pointer"
                  transition="all .4s ease-in-out"
                  _hover={{ color: useColorModeValue('brand.300', 'white') }}
                >
                  Home
                </chakra.a>
              </NextLink>
              <NextLink href="/settings" passHref>
                <chakra.a
                  fontSize="sm"
                  fontWeight="semibold"
                  color={useColorModeValue('brand.500', 'brand.200')}
                  cursor="pointer"
                  transition="all .4s ease-in-out"
                  _hover={{ color: useColorModeValue('brand.300', 'white') }}
                >
                  Settings
                </chakra.a>
              </NextLink>

              <IconButton
                size="md"
                fontSize="lg"
                aria-label={`Switch to ${text} mode`}
                variant="ghost"
                color="current"
                ml={{ base: '0', md: '3' }}
                onClick={toggleMode}
                icon={<SwitchIcon />}
              />
            </HStack>
          </Flex>
        </chakra.div>
      </chakra.header>
    </React.Fragment>
  );
}
