import { AlertProps } from '@chakra-ui/react';

export interface Cloudinary {
  cloudName?: string;
  preset?: string;
}

export interface Account {
  id: string;
  name: string;
  picture: string;
  accessToken: string;
}

export interface AdAccount {
  id: string;
  account_id: string;
}

export interface Page {
  id: string;
  name: string;
  access_token: string;
  selected?: boolean;
  status?: 'posting' | 'get_post_id' | 'publishing' | 'completed' | 'error';
  postedUrl?: string;
  error?: string;
}

export type MessageProps = {
  text: string;
  status?: AlertProps['status'];
};

export interface Thumbnail {
  id: string;
  height: number;
  scale: number;
  uri: string;
  width: number;
  is_preferred: boolean;
  isLocalUpload?: boolean;
}

export interface VideoFromURL {
  id: string;
  source: string;
  message: string;
  created_time: string;
}
