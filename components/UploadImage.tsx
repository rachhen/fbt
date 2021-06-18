import React, { ChangeEvent, FC, useState } from 'react';
import {
  Box,
  AspectRatio,
  Input,
  InputProps,
  Image,
  FormLabel,
  Progress,
  Text,
} from '@chakra-ui/react';
import { getData } from '../utils/storage';

type UploadImageProps = InputProps & {
  progress?: number;
};

const UploadImage: FC<UploadImageProps> = ({ onChange, value, progress }) => {
  const [image, setImage] = useState<any>(value ? value : '/noimage.png');

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImage(e.target?.result!);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const cloudinary = getData('cloudinary');

  return (
    <Box position="relative" maxW="250px" borderRadius="sm">
      <AspectRatio
        maxW="250px"
        ratio={4 / 3}
        borderRadius="sm"
        overflow="hidden"
      >
        <Image src={image} alt="naruto" objectFit="cover" />
      </AspectRatio>
      {progress !== 0 && (
        <Progress size="xs" value={progress} colorScheme="red" />
      )}
      {!cloudinary?.preset || !cloudinary?.cloudName ? (
        <Box
          p="1.5"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          position="absolute"
          alignItems="center"
          bg="blackAlpha.500"
          justifyContent="center"
        >
          <Text color="whiteAlpha.800" align="center" fontSize="sm">
            You cann't use this action, please setup on your cloudinary settings
          </Text>
        </Box>
      ) : (
        <Box position="absolute" width="100%" bottom="0" bg="blackAlpha.500">
          <FormLabel
            p="2"
            m="0"
            fontSize="xs"
            color="white"
            htmlFor="image"
            textAlign="center"
            _hover={{ cursor: 'pointer' }}
          >
            Select Image
          </FormLabel>
          <Input
            id="image"
            accept="image/*"
            type="file"
            onChange={onFileChange}
            display="none"
          />
        </Box>
      )}
    </Box>
  );
};

export default UploadImage;
