import React, { ChangeEvent, FC, useRef, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios, { CancelTokenSource } from 'axios';

import UploadVideo from './UploadVideo';
import { getData } from '../utils/storage';
import { createAdVideo, getThumbnails } from '../services';
import { PostTypeProps } from './PostType';
import Thumbnails from './Thumbnails';
import PostData from './PostData';
import { SmallCloseIcon } from '@chakra-ui/icons';

type UploadedVideo = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
};

const PostVideoUpload: FC<PostTypeProps> = ({
  adAccountId,
  account,
  setMessage,
}) => {
  const [previewVideo, setPreviewVideo] = useState<any>();
  const [selectedVideo, setSelectedVideo] = useState<FileList>();
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo>();
  const [videoId, setVideoId] = useState<string>(); //1588053291387685
  const [thumbUrl, setThumbUrl] = useState<string>();
  const [peThumbUrl, setPeThumbUrl] = useState<string>();
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const cancelToken = useRef<CancelTokenSource>();

  const handleUpload = async () => {
    const cloudinary = getData('cloudinary');
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/upload`;

    if (selectedVideo && selectedVideo[0]) {
      const formData = new FormData();
      formData.append('file', selectedVideo[0]);
      formData.append('upload_preset', cloudinary.preset);

      cancelToken.current = axios.CancelToken.source();
      try {
        setLoading(true);
        const { data } = await axios.post(endpoint, formData, {
          cancelToken: cancelToken.current.token,
          onUploadProgress,
        });
        setUploadedVideo(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        if (err.response) {
          setMessage({ status: 'error', text: err.toString() });
        }
        setLoading(false);
      }
    }
  };

  const onUploadProgress = ({ loaded, total }) => {
    const percentCompleted = Math.round((loaded * 100) / total);
    setProgress(percentCompleted);
  };

  const handleProcess = async () => {
    try {
      setProcessing(true);
      const id = await createAdVideo(
        adAccountId,
        uploadedVideo.secure_url,
        account.accessToken
      );

      const interval = setInterval(async () => {
        const thumbs = await getThumbnails(id, account.accessToken);
        if (thumbs.length !== 0) {
          setProcessing(false);
          setVideoId(id);
          clearInterval(interval);
        }
      }, 9000);
    } catch (err) {
      setMessage({ status: 'error', text: err.toString() });
    }
  };

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const size = file.size;
      if (size > 104857600) {
        return alert(
          `Video file "${file.name}" is to large, Please select video under 100MB`
        );
      }

      setSelectedVideo(target.files);
      setUploadedVideo(undefined);

      const reader = new FileReader();
      reader.onload = function (e) {
        setPreviewVideo(e.target?.result!);
      };
      reader.readAsDataURL(target.files[0]);
    }
  };

  return (
    <Flex flexDir="column">
      <Stack direction={['column', 'row']} spacing="5">
        <Flex flexDir="column" align="center" width="250px" overflow="hidden">
          <UploadVideo progress={progress} onChange={onChange} />
          {selectedVideo && (
            <ButtonGroup mt="5" w="100%" isDisabled={!!uploadedVideo}>
              <Button
                onClick={handleUpload}
                isLoading={loading}
                loadingText={`Uploaded ${progress}%`}
                w="100%"
              >
                Upload
              </Button>
              {loading && (
                <IconButton
                  onClick={() => cancelToken.current.cancel()}
                  aria-label="Cancel upload"
                  icon={<SmallCloseIcon />}
                />
              )}
            </ButtonGroup>
          )}
          {uploadedVideo && (
            <Button
              mt="5"
              onClick={handleProcess}
              isLoading={processing}
              loadingText="Processing..."
            >
              Proccess Video
            </Button>
          )}
        </Flex>
        <Box h={['250px', '280px', '305px', '450px']} width="100%">
          {previewVideo && (
            <video
              src={previewVideo}
              controls
              style={{ borderRadius: 5, height: '100%' }}
            />
          )}
        </Box>
      </Stack>
      {videoId && (
        <Thumbnails
          videoId={videoId}
          accessToken={account.accessToken}
          onChange={(thumb, pe) => {
            setThumbUrl(thumb.uri);
            pe && setPeThumbUrl(pe.uri);
          }}
        />
      )}
      {videoId && thumbUrl && peThumbUrl && (
        <PostData
          account={account}
          videoId={videoId}
          message={''}
          adAccountId={adAccountId}
          thumbUrl={thumbUrl}
          peImageUrl={peThumbUrl}
        />
      )}
      {processing && (
        <Flex
          w="100%"
          h="100vh"
          position="absolute"
          left={0}
          top={0}
          bg="blackAlpha.200"
          align="center"
          justify="center"
          padding="5"
        >
          <Flex align="center" bg="white" py="2" px="5" borderRadius="base">
            <Text>Proccessing Video...</Text> &nbsp; <Spinner size="sm" />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default PostVideoUpload;
