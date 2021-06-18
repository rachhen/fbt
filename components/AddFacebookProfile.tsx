import React, { Fragment, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  chakra,
  Button,
  FormErrorMessage,
  Avatar,
  Text,
  useBreakpointValue,
  SimpleGrid,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  useDisclosure,
  FormHelperText,
  Link,
  Kbd,
  Code,
  Heading,
} from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DeleteIcon } from '@chakra-ui/icons';

import FB from '../services/api';
import { addAccount, removeAccount, getData } from '../utils/storage';
import { Account } from '../types';

interface IFormInputs {
  accessToken: string;
}

const schema = yup.object().shape({
  accessToken: yup.string().required().label('Access Token'),
});

const endpoint = '/me?fields=id,name,picture{url,width,height}';

function AddFacebookProfile() {
  const { register, handleSubmit, reset, formState } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  const [checking, setChecking] = useState(false);
  const [accounts, setAccounts] = useState(getData('accounts'));
  const [existingAccount, setExistingAccount] = useState<Account>(null);
  const buttonW = useBreakpointValue({ base: 'full', md: '' });
  const px = useBreakpointValue({ base: '5', md: '' });
  const cancelRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async ({ accessToken }: IFormInputs) => {
    setChecking(true);

    FB.get(`${endpoint}&access_token=${accessToken}`, { headers: {} })
      .then(({ data }) => {
        const account = {
          id: data.id,
          name: data.name,
          picture: data.picture.data.url,
          accessToken,
        };
        const index = accounts.findIndex((acc) => acc.id === account.id);
        if (index != -1) {
          setChecking(false);
          setExistingAccount(account);
          return onOpen();
        }
        addAccount(account);
        setAccounts([...accounts, account]);

        setChecking(false);
        reset();
      })
      .catch((err) => {
        console.log(err);
        setChecking(false);
      });
  };

  const onRemove = (account: Account) => {
    if (confirm(`Do you want to remove ${account.name}?`)) {
      removeAccount(account.id);
      setAccounts(accounts.filter((acc) => acc.id !== account.id));
    }
  };

  const { errors } = formState;

  return (
    <Fragment>
      <chakra.form px={px} pt="5" onSubmit={handleSubmit(onSubmit)}>
        <Heading pb="3" size="md">
          Facebook Profile
        </Heading>
        <FormControl id="accessToken" isInvalid={!!errors.accessToken}>
          <FormLabel>Access Token</FormLabel>
          <Input
            placeholder="Past your Facebook access token here..."
            {...register('accessToken')}
          />
          {errors.accessToken && (
            <FormErrorMessage>{errors.accessToken.message}</FormErrorMessage>
          )}
          <FormHelperText>
            You can get you access token by{' '}
            <Link
              isExternal
              href="https://mobile.facebook.com/composer/ocelot/async_loader/?publisher=feed&_rdc=5&_rdr"
              color="blue.500"
            >
              click here{' '}
            </Link>
            and <Kbd>Cmd or Ctrl</Kbd> + <Kbd>f</Kbd> type <Code>EAA</Code> and
            then copy all string in blockquote and past here.{' '}
            <strong>Note:</strong> You need to login to your account first.
          </FormHelperText>
        </FormControl>
        <Button
          mt={4}
          type="submit"
          isLoading={checking}
          loadingText="Checking..."
          w={buttonW}
        >
          Check Profile & Add
        </Button>
      </chakra.form>
      <SimpleGrid columns={[2, null, 5]} spacing="16px" pt="5">
        {accounts.map((item, index) => (
          <Box
            key={`${item.id}-${index}`}
            display="flex"
            flexDirection="column"
            alignItems="center"
            border="1px"
            borderColor="inherit"
            borderRadius="base"
            px="3"
            py="5"
          >
            <Avatar size="md" name={item.name} src={item.picture} />
            <Text>{item.name}</Text>
            <Button
              colorScheme="red"
              size="xs"
              mt="3"
              onClick={() => onRemove(item)}
            >
              <DeleteIcon />
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Existing Account!</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Account "{existingAccount?.name}" already exist.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onClose();
                setExistingAccount(null);
              }}
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}

export default AddFacebookProfile;
