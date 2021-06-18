import React, { FC, useEffect, useRef, useState } from 'react';
import { AiFillPlayCircle } from 'react-icons/ai';
import {
  AspectRatio,
  Box,
  SimpleGrid,
  Image,
  Button,
  Heading,
  Icon,
} from '@chakra-ui/react';

import { getAdVideos } from '../services';
import { Account, MessageProps } from '../types';
import Thumbnails from './Thumbnails';
import PostData from './PostData';

type Props = FC<{
  account: Account;
  adAccountId: string;
  setMessage?: (props: MessageProps) => void;
}>;

type Video = {
  id: string;
  picture: string;
  source: string;
};
type PagingCursor = {
  after?: string;
  before?: string;
  isEnd?: boolean;
};

const PostVideoRecent: Props = ({ account, adAccountId, setMessage }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selected, setSelected] = useState<Video | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [thumbUrl, setThumbUrl] = useState<string>();
  const [peThumbUrl, setPeThumbUrl] = useState<string>();
  const scrollRef = useRef<HTMLDivElement>();
  const [pagingCursor, setPagingCursor] = useState<PagingCursor>({
    after: '',
    isEnd: false,
  });

  const loadMoreVideos = async () => {
    if (pagingCursor.after && !loading && !loadMore) {
      setLoadMore(true);
      try {
        const videoData = await getAdVideos(
          adAccountId,
          account.accessToken,
          pagingCursor.after
        );
        setVideos((prev) => prev.concat(videoData.data));
        if (videoData.paging) {
          setPagingCursor(videoData.paging.cursors);
        } else {
          setPagingCursor({ before: '', after: '', isEnd: true });
        }
        setLoadMore(false);
        scrollRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      } catch (err) {
        console.log(err);
        setLoadMore(false);
        if (err.response) {
          setMessage({
            text: 'Unable to fetch more video',
            status: 'error',
          });
        }
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const videoData = await getAdVideos(adAccountId, account.accessToken);
        setVideos(videoData.data);
        setLoading(false);
        if (videoData.paging) setPagingCursor(videoData.paging.cursors);
      } catch (err) {
        setMessage({
          text: err.message,
          status: 'error',
        });
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Box>
      <Box overflowY="auto" h={['350px', null, null, null]}>
        <SimpleGrid columns={[2, 3, 5]} spacing="5" ref={scrollRef}>
          {videos.map((video) => (
            <RecentVideoItem
              key={video.id}
              video={video}
              selected={selected}
              onClick={() => setSelected(video)}
            />
          ))}
        </SimpleGrid>
      </Box>
      {!pagingCursor.isEnd && (
        <Button mt="5" onClick={loadMoreVideos} isLoading={loadMore}>
          Load More
        </Button>
      )}
      {selected && (
        <Box py="5">
          <Heading size="md" pb="2">
            Preview Video
          </Heading>
          <Box h="450px" width="100%">
            <video
              src={selected.source}
              controls
              style={{ borderRadius: 5, height: '100%' }}
            />
          </Box>

          <Heading size="md" pt="5">
            Thumbnails
          </Heading>
          <Thumbnails
            videoId={selected.id}
            accessToken={account.accessToken}
            onChange={(thumb, pe) => {
              setThumbUrl(thumb.uri);
              pe && setPeThumbUrl(pe.uri);
            }}
          />
        </Box>
      )}
      {selected && thumbUrl && peThumbUrl && (
        <PostData
          account={account}
          videoId={selected.id}
          message={''}
          adAccountId={adAccountId}
          thumbUrl={thumbUrl}
          peImageUrl={peThumbUrl}
        />
      )}
    </Box>
  );
};

export default PostVideoRecent;

type RecentVideoItemProps = {
  video: Video;
  selected?: Video;
  onClick?: () => void;
};
const RecentVideoItem = ({
  video,
  selected,
  onClick,
}: RecentVideoItemProps) => {
  return (
    <Box
      maxW="250px"
      position="relative"
      _hover={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <AspectRatio
        flex="1"
        maxW="250px"
        ratio={4 / 3}
        border={video.id === selected?.id ? '4px' : 0}
        borderColor="red.500"
        borderRadius="md"
      >
        <Image
          borderRadius="sm"
          src={video.picture}
          objectFit="cover"
          alt={`Video ${video.id}`}
        />
      </AspectRatio>
      <Box
        position="absolute"
        left={0}
        top={0}
        w="100%"
        h="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Icon as={AiFillPlayCircle} boxSize="9" color="white" />
      </Box>
    </Box>
  );
};
