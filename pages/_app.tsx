import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

import Layout from '../components/Layout';
import theme from '../theme';
// import '../styles/date-picker.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <DefaultSeo
        titleTemplate="%s | FBT"
        defaultTitle="Facebook PE tools"
        description="Tool for posting video carousel to your pages"
        openGraph={{
          url: '',
          site_name: 'Facebook PE tools',
          title: 'FBT',
          description: 'Tool for posting video carousel to your pages',
          type: 'website',
          locale: 'en_IE',
          images: [
            {
              url: '/facebook_profile_image.jpg',
              width: 800,
              height: 600,
              alt: 'Og Image Alt',
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/logo.png',
          },
          {
            rel: 'apple-touch-icon',
            href: '/logo.png',
            sizes: '76x76',
          },
        ]}
        twitter={{
          handle: '@iamwoufu',
          site: '@iamwoufu',
          cardType: 'summary_large_image',
        }}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default MyApp;
