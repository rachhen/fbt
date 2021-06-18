import axios from 'axios';
import { VideoFromURL, Thumbnail } from '../types';

import api from './api';

export const getVideoUrl = async (
  url: string,
  accessToken: string
): Promise<VideoFromURL | null> => {
  if (url.match(/facebook\.com/g)) {
    if (url.match(/permalink\.php/g) || url.match(/story\.php/g)) {
      if (url.match(/story_fbid=([^=]+)\&/g)) {
        const m = url.match(/story_fbid=([^=]+)\&/);
        return await getFacebookVideoURL(m[1], accessToken);
      }
    } else if (url.match(/\/videos\//g)) {
      var spl1 = url.split('videos/');
      const spl2 = spl1[1].split('/');
      if (spl2.length >= 2) {
        return await getFacebookVideoURL(spl2[0], accessToken);
      } else {
        return await getFacebookVideoURL(spl1[1], accessToken);
      }
    } else if (url.match(/\/posts\//g)) {
      const spl1 = url.split('posts/');
      const spl2 = spl1[1].split('/');
      if (spl2.length >= 2) {
        return await getFacebookVideoURL(spl2[0], accessToken);
      } else {
        return await getFacebookVideoURL(spl1[1], accessToken);
      }
    } else if (url.match(/watch\/\?v=/g)) {
      const spl1 = url.split('v=');
      const spl2 = spl1[1].split('&');
      if (spl2.length >= 2) {
        return await getFacebookVideoURL(spl2[0], accessToken);
      } else {
        return await getFacebookVideoURL(spl1[1], accessToken);
      }
    }
  } else {
    return {
      id: null,
      source: url,
      message: '',
      created_time: Date.now().toString(),
    };
  }
};

const getFacebookVideoURL = async (
  id: string,
  access_token: string
): Promise<VideoFromURL | null> => {
  const baseUrl = 'https://graph.facebook.com';
  try {
    const { data: videoInfo } = await axios.get(
      `${baseUrl}/${id}?access_token=${access_token}&fields=id,from`
    );
    const videoId = `${videoInfo.from.id}_${videoInfo.id}`;
    const { data: video } = await axios.get(
      `${baseUrl}/${videoId}?access_token=${access_token}&fields=id,message,child_attachments,source`
    );

    if (video.source) {
      return video;
    }

    // If video is PE video
    if (video.child_attachments) {
      const vid_link =
        video.child_attachments[0].link.match(/videos\/([^\/]+)\//);
      const vid_id = vid_link[1];
      const { data } = await axios.get(
        `${baseUrl}/${vid_id}?access_token=${access_token}&fields=id,source`
      );

      return data;
    }
    return null;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createAdVideo = async (
  adAccountId: string,
  fileUrl: string,
  accessToken: string
): Promise<string> => {
  const formData = new FormData();
  formData.append('file_url', fileUrl);
  formData.append('access_token', accessToken);

  return api
    .post(`/${adAccountId}/advideos`, formData)
    .then(({ data }) => data.id);
};

export const getThumbnails = (
  videoId: string,
  accessToken: string
): Promise<Thumbnail[]> => {
  return api
    .get(`/${videoId}/thumbnails?access_token=${accessToken}`)
    .then(({ data }) => data.data);
};
