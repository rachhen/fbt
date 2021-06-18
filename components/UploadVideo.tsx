import React, { FC } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import {
  Flex,
  FormLabel,
  Icon,
  Input,
  Text,
  InputProps,
  Progress,
  Tooltip,
} from '@chakra-ui/react';

type UploadVideoProps = InputProps & {
  progress?: number;
};

const UploadVideo: FC<UploadVideoProps> = ({ progress, ...props }) => {
  return (
    <Flex>
      <FormLabel
        m="0"
        fontSize="xs"
        htmlFor="video"
        textAlign="center"
        _hover={{ cursor: 'pointer' }}
      >
        <Tooltip
          hasArrow
          placement="top"
          label="Make sure you video size is under 100MB. Cloudinary allow free plan video upload only 100MB."
          aria-label="upload tooltip"
        >
          <Flex
            w="200px"
            h="150px"
            border="1px"
            borderColor="inherit"
            borderRadius="base"
            align="center"
            justify="center"
            flexDir="column"
          >
            <Icon as={AiOutlineCloudUpload} boxSize="16" color="gray.400" />
            <Text>Select Video</Text>
          </Flex>
        </Tooltip>
        {!!progress && progress !== 0 && (
          <Progress
            size="xs"
            value={progress}
            colorScheme="red"
            borderRadius="base"
          />
        )}
      </FormLabel>
      <Input
        {...props}
        id="video"
        accept="video/*"
        type="file"
        display="none"
      />
    </Flex>
  );
};

export default UploadVideo;
