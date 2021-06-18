import React, { FC, useState } from 'react';
import { Box, Center, HStack } from '@chakra-ui/layout';
import {
  FormControl,
  Input,
  FormHelperText,
  chakra,
  IconButton,
  FormErrorMessage,
  AspectRatio,
  Button,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Account, VideoFromURL, MessageProps, Thumbnail } from '../types';
import { AddIcon } from '@chakra-ui/icons';
import { getVideoUrl, createAdVideo } from '../services/video';
import Thumbnails from './Thumbnails';
import PostData from './PostData';

type PostVideoURLProps = {
  adAccountId: string;
  account: Account;
  setMessage?: (props: MessageProps) => void;
};

interface IFormInputs {
  url: string;
}

const schema = Yup.object().shape({
  url: Yup.string()
    .required()
    .matches(
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'URL must be valid'
    )
    .label('URL'),
});

const PostVideoURL: FC<PostVideoURLProps> = ({
  adAccountId,
  account,
  setMessage,
}) => {
  const { register, handleSubmit, formState } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  const [video, setVideo] = useState<VideoFromURL>(null);
  const [videoId, setVideoId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [proccessVideo, setProccessVideo] = useState(false);
  const [image, setImage] =
    useState<{
      thumb?: Thumbnail;
      rightSide?: Thumbnail;
    }>();

  const onSubmit = async ({ url }: IFormInputs) => {
    setLoading(true);
    try {
      const videoSource = await getVideoUrl(url, account.accessToken);
      if (videoSource) {
        setVideo(videoSource);
        setVideoId(null);
      } else {
        setMessage({
          text: 'Oops😱 , That url not yet supported!',
          status: 'error',
        });
      }
      setLoading(false);
    } catch (err) {}
  };

  const processVideo = async () => {
    try {
      setProccessVideo(true);
      const id = await createAdVideo(
        adAccountId,
        video.source,
        account.accessToken
      );
      setProccessVideo(false);
      setVideoId(id);
    } catch (err) {
      setMessage({ status: 'info', text: err.toString() });
    }
  };

  const { errors } = formState;

  return (
    <Box>
      <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="url" isInvalid={!!errors.url}>
          <HStack>
            <Input type="url" placeholder="Video URL" {...register('url')} />
            <IconButton
              type="submit"
              aria-label="add url"
              icon={<AddIcon />}
              isLoading={loading}
            />
          </HStack>
          {errors.url && (
            <FormErrorMessage>{errors.url.message}</FormErrorMessage>
          )}
          <FormHelperText>
            You can copy from facebook or video uri. And then past here if it
            can play your url is correct.
          </FormHelperText>
        </FormControl>
      </chakra.form>
      {video && (
        <Box py="5" h={['250px', '280px', '305px', '450px']} width="100%">
          <video
            src={video.source}
            controls
            style={{ borderRadius: 5, height: '100%' }}
          />
        </Box>
      )}
      {video && !videoId && (
        <Button onClick={processVideo}>Process Video</Button>
      )}
      {proccessVideo ? (
        <Center width="1200px" p="5">
          <Spinner />
          <Text>Processing Video</Text>
        </Center>
      ) : (
        videoId && (
          <Thumbnails
            videoId={videoId}
            accessToken={account.accessToken}
            onChange={(t, r) => setImage({ thumb: t, rightSide: r })}
          />
        )
      )}
      {videoId && image && (
        <PostData
          account={account}
          videoId={videoId}
          message={video?.message}
          adAccountId={adAccountId}
          thumbUrl={image.thumb?.uri}
          peImageUrl={image.rightSide?.uri}
        />
      )}
    </Box>
  );
};

export default PostVideoURL;
