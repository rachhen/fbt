import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Box,
  Spinner,
  SimpleGrid,
  AspectRatio,
  Image,
  Alert,
  AlertIcon,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Badge,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { FiRefreshCcw } from 'react-icons/fi';

import UploadImage from './UploadImage';
import { getThumbnails } from '../services';
import { Thumbnail } from '../types';
import axios from 'axios';
import { addImage, getData } from '../utils/storage';

type ThumbnailsProps = {
  videoId: string;
  accessToken: string;
  onChange?: (thumb?: Thumbnail, rightSide?: Thumbnail) => void;
};

const Thumbnails: FC<ThumbnailsProps> = ({
  videoId,
  accessToken,
  onChange,
}) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [thumbSelected, setThumbSelected] = useState<Thumbnail>();
  const [rightSelected, setRightSelected] = useState<Thumbnail>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [uploaded, setUploaded] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cloudinary = getData('cloudinary');
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/upload`;

    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('upload_preset', cloudinary.preset);
      axios
        .post(endpoint, formData, {
          onUploadProgress: ({ loaded, total }) => {
            const percentCompleted = Math.round((loaded * 100) / total);
            setUploaded(percentCompleted);
          },
        })
        .then(({ data }) => {
          const image = {
            id: Date.now().toString(),
            height: data.width,
            scale: 1,
            uri: data.secure_url,
            width: data.width,
            is_preferred: false,
            isLocalUpload: true,
          };
          setThumbnails([...thumbnails, image]);
          addImage(image);
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
          onOpen();
        });
    }
  };

  const onRefresh = async () => {
    setLoading(true);
    const thumbs = await getThumbnails(videoId, accessToken);
    setThumbnails([...thumbs, ...getData('images')]);
    setLoading(false);
  };

  useEffect(() => {
    onRefresh();

    // setLoading(true);
    // const interval = setInterval(async () => {
    //   try {
    //     const thumbs = await getThumbnails(videoId, accessToken);
    //     if (thumbs.length > 5) {
    //       clearInterval(interval);
    //       setThumbnails([...thumbs, ...getData('images')]);
    //       setLoading(false);
    //     }
    //   } catch (err) {
    //     setLoading(false);
    //     setError(err.message);
    //     clearInterval(interval);
    //     onOpen();
    //   }
    // }, 5000);
  }, [videoId]);

  if (error) {
    return (
      <Alert status="error" variant="left-accent">
        <AlertIcon />
        Getting thumbnails: {error}
      </Alert>
    );
  }

  return (
    <Box pt="5">
      {loading ? (
        <Box
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
          <Text>Getting thumbnails</Text>
        </Box>
      ) : (
        <>
          <Tabs>
            <TabList position="relative">
              <Tab _focus={{ outline: 'none' }}>Select Thumbnails</Tab>
              <Tab _focus={{ outline: 'none' }}>Right Side Image</Tab>
              <Box position="absolute" bottom={0} right={0} mb="2">
                <Button onClick={onRefresh} size="xs">
                  <FiRefreshCcw />
                </Button>
              </Box>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <SimpleGrid columns={[2, 3, 5]} spacing="5">
                  {thumbnails.map((thumb) => (
                    <Box
                      key={thumb.id}
                      maxW="250px"
                      position="relative"
                      _hover={{ cursor: 'pointer' }}
                    >
                      <AspectRatio
                        flex="1"
                        maxW="250px"
                        ratio={4 / 3}
                        border={thumb.id === thumbSelected?.id ? '4px' : 0}
                        borderColor="red.500"
                        borderRadius="md"
                        onClick={() => {
                          setThumbSelected(thumb);
                          onChange?.(thumb, rightSelected);
                        }}
                      >
                        <Image
                          borderRadius="sm"
                          src={thumb.uri}
                          objectFit="cover"
                          alt="Thumbnail"
                        />
                      </AspectRatio>
                      {thumb.isLocalUpload && (
                        <Box position="absolute" bottom={0} px="2" mb="2">
                          <Badge variant="solid" colorScheme="red">
                            Own
                          </Badge>
                        </Box>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel px={0}>
                <SimpleGrid columns={[2, 3, 5]} spacing="5">
                  {thumbnails.map((rightThumb) => (
                    <Box
                      key={rightThumb.id}
                      maxW="250px"
                      position="relative"
                      _hover={{ cursor: 'pointer' }}
                    >
                      <AspectRatio
                        flex="1"
                        maxW="250px"
                        ratio={4 / 3}
                        border={rightThumb.id === rightSelected?.id ? '4px' : 0}
                        borderColor="red.500"
                        borderRadius="md"
                        onClick={() => {
                          setRightSelected(rightThumb);
                          onChange?.(thumbSelected, rightThumb);
                        }}
                      >
                        <Image
                          borderRadius="sm"
                          src={rightThumb.uri}
                          objectFit="cover"
                          alt="Thumbnail"
                        />
                      </AspectRatio>
                      {rightThumb.isLocalUpload && (
                        <Box position="absolute" bottom={0} px="2" mb="2">
                          <Badge variant="solid" colorScheme="red">
                            Own
                          </Badge>
                        </Box>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Box mt="5">
            <Text>Custom Thumbnail</Text>
            <UploadImage onChange={onImageChange} progress={uploaded} />
          </Box>
        </>
      )}
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Error occurr</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{error}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default Thumbnails;
