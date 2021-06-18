export const CTA = [
  { value: 'NO_BUTTON', text: 'No Button' },
  { value: 'LIKE_PAGE', text: 'Like Page' },
  { value: 'LEARN_MORE', text: 'Learn More' },
  { value: 'BOOK_TRAVEL', text: 'Book Travel' },
  { value: 'CONTACT_US', text: 'Contact Us' },
  { value: 'DOWNLOAD', text: 'Download' },
  { value: 'GET_QUOTE', text: 'Get Quote' },
  { value: 'INSTALL_APP', text: 'Install App' },
  { value: 'LISTEN_MUSIC', text: 'Listen Music' },
  { value: 'MESSAGE_PAGE', text: 'Message Page' },
  { value: 'OPEN_LINK', text: 'Open Link' },
  { value: 'PLAY_GAME', text: 'Play Game' },
  { value: 'SHOP_NOW', text: 'Shop Now' },
  { value: 'SIGN_UP', text: 'Sign Up' },
  { value: 'SUBSCRIBE', text: 'Subscribe' },
  { value: 'USE_APP', text: 'Use App' },
  { value: 'WATCH_MORE', text: 'Watch More' },
  { value: 'WATCH_VIDEO', text: 'Watch Video' },
];

export type ValueType = {
  message: string;
  cta: string;
  link: string;
  ctaLinkTitle: string;
  publishedAt: Date;
  isPublish: boolean;
};

type AdcreativeData = {
  name: string;
  pageId: string;
  videoId: string;
  thumbnailUri: string;
  peImage: string;
  accessToken: string;
  values: ValueType;
};

export const getAdcreativeData = (input: AdcreativeData) => {
  let cta_link = input.values.link;
  if (!cta_link) {
    cta_link = `https://facebook.com/${input.pageId}`;
  }
  return {
    name: input.name,
    object_story_spec: {
      page_id: input.pageId,
      link_data: {
        message: input.values.message,
        caption: cta_link,
        link: cta_link,
        multi_share_optimized: false,
        child_attachments: [
          {
            name: input.values.ctaLinkTitle,
            link: cta_link,
            video_id: input.videoId,
            picture: input.thumbnailUri,
            call_to_action: {
              type: input.values.cta,
              value: {
                page: input.pageId,
              },
            },
          },
          {
            name: input.values.ctaLinkTitle,
            link: cta_link,
            picture: input.peImage,
            call_to_action: {
              type: input.values.cta,
              value: {
                page: input.pageId,
              },
            },
          },
        ],
      },
    },
    access_token: input.accessToken,
  };
};
