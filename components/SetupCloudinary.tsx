import { Box, Heading, HStack, Kbd } from '@chakra-ui/layout';
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Link,
  Button,
  useBreakpointValue,
  FormErrorMessage,
  IconButton,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { chakra } from '@chakra-ui/system';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiEye, HiEyeOff } from 'react-icons/hi';

import { getData, setupCloudinary } from '../utils/storage';

interface IFormInputs {
  cloudName: string;
  preset: string;
}

const schema = yup.object().shape({
  cloudName: yup.string().required().label('Cloud Name'),
  preset: yup.string().required().label('Preset'),
});

function SetupCloudinary() {
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState(false);
  const { register, handleSubmit, formState } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: getData('cloudinary'),
  });

  const onSubmit = ({ cloudName, preset }: IFormInputs) => {
    setupCloudinary({ cloudName, preset });
    setAlert(true);
    setTimeout(() => setAlert(false), 5000);
  };

  const onClickReveal = () => {
    onToggle();
    const input = inputRef.current;
    if (input) {
      input.focus({ preventScroll: true });
      const length = input.value.length * 2;
      requestAnimationFrame(() => {
        input.setSelectionRange(length, length);
      });
    }
  };

  const { errors } = formState;

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)}>
      <Heading pb="3" size="md">
        Setup Cloudinary
      </Heading>
      {alert && (
        <Alert status="success" variant="left-accent" mb="3">
          <AlertIcon />
          Saved Cloudinary settings successfully.
        </Alert>
      )}
      <HStack align="stretch">
        <FormControl id="cloudName" isInvalid={!!errors.cloudName}>
          <FormLabel>Cloud Name</FormLabel>
          <Input {...register('cloudName')} />
          {errors.cloudName && (
            <FormErrorMessage>{errors.cloudName.message}</FormErrorMessage>
          )}
          <FormHelperText>
            Sign In to your Cloudinary account. Dashboard {'->'} Account Details{' '}
            {'->'} Cloud name, Example: <Kbd>Cloud name: woufu</Kbd>
          </FormHelperText>
        </FormControl>
        <FormControl id="preset" isInvalid={!!errors.preset}>
          <FormLabel>Preset</FormLabel>
          <InputGroup>
            <InputRightElement>
              <IconButton
                bg="transparent !important"
                variant="ghost"
                aria-label={isOpen ? 'Mask password' : 'Reveal password'}
                icon={isOpen ? <HiEyeOff /> : <HiEye />}
                onClick={onClickReveal}
              />
            </InputRightElement>
            <Input
              ref={inputRef}
              type={isOpen ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('preset')}
            />
          </InputGroup>
          {errors.preset && (
            <FormErrorMessage>{errors.preset.message}</FormErrorMessage>
          )}
          <FormHelperText>
            Your Cloudinary unsigned preset. we using cloudinary to upload
            videos or images.{' '}
            <Link
              isExternal
              href="https://cloudinary.com/documentation/upload_presets"
              color="blue.500"
            >
              learn more
            </Link>
          </FormHelperText>
        </FormControl>
      </HStack>
      <Button
        mt={4}
        type="submit"
        w={useBreakpointValue({ base: 'full', md: '' })}
      >
        Save
      </Button>
    </chakra.form>
  );
}

export default SetupCloudinary;
