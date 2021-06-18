import React, { FC, useEffect, useState } from 'react';
import { Box, VStack } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  Textarea,
  Text,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  Link,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import moment from 'moment';

import { DatePicker } from './DatePicker';
import { Account, Page, Thumbnail } from '../types';
import { CTA, getAdcreativeData, ValueType } from '../constants/cta';
import {
  createCreative,
  getCreativeInfo,
  getPages,
  publishCreative,
} from '../services';

const schema = Yup.object().shape({
  message: Yup.string().label('Caption'),
  cta: Yup.string().label('CTA'),
});

type PostDataProps = {
  message?: string;
  videoId: string;
  account: Account;
  adAccountId: string;
  thumbUrl?: string;
  peImageUrl?: string;
};

type UpdateAttrs = {
  status: 'posting' | 'get_post_id' | 'publishing' | 'completed' | 'error';
  postedUrl?: string;
  error?: string;
};

const initialError = {
  title: '',
  message: '',
};

const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

const PostData: FC<PostDataProps> = ({
  message,
  account,
  videoId,
  thumbUrl,
  peImageUrl,
  adAccountId,
}) => {
  const { register, handleSubmit, control, formState } = useForm<ValueType>({
    resolver: yupResolver(schema),
    defaultValues: {
      message,
      cta: CTA[1].value,
      isPublish: true,
      publishedAt: new Date(),
      ctaLinkTitle: 'Like Page 🙏',
    },
  });
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const onSubmit = async (values: ValueType) => {
    setError(initialError);
    const selectedPages = pages.filter((page) => page.selected);
    if (!selectedPages || selectedPages.length === 0) {
      setError({
        title: 'Message',
        message: 'Please select at least one page!',
      });
      return onOpen();
    }

    setLoading(true);
    for (let i = 0; i < pages.length; i++) {
      const page = selectedPages[i];
      const adcreativeData = getAdcreativeData({
        name: Date.now().toString(),
        values,
        videoId,
        pageId: page?.id,
        peImage: peImageUrl,
        thumbnailUri: thumbUrl,
        accessToken: account.accessToken,
      });

      setStatus(`Publishing to ${page.name}...`);
      try {
        updatePageState(page.id, { status: 'posting', error: '' });
        const creative = await createCreative(adAccountId, adcreativeData);

        updatePageState(page.id, { status: 'get_post_id' });
        const creativeInfo = await getCreativeInfo(
          creative.id,
          account.accessToken
        );

        updatePageState(page.id, { status: 'publishing' });
        const body: any = { access_token: page.access_token };
        if (values.isPublish) {
          body['is_published'] = true;
        } else {
          body['scheduled_publish_time'] = moment(values.publishedAt).format(
            'X'
          );
        }
        const success = publishCreative(
          creativeInfo.effective_object_story_id,
          body
        );

        if (success) {
          const postedUrl = `https://www.facebook.com/${creativeInfo.effective_object_story_id}`;
          updatePageState(page.id, { status: 'completed', postedUrl });
        } else {
          updatePageState(page.id, {
            status: 'error',
            error: 'Publish failed',
          });
        }

        if (selectedPages.length - 1 > i) {
          setStatus(`Delay 5 second....`);
          await timer(5000);
        }
      } catch (err) {
        console.log(err);
        updatePageState(page.id, {
          status: 'error',
          error: err.message,
        });
      }
    }
    setStatus(`Publishing Completed!`);
    setLoading(false);
  };

  const updatePageState = (id: string, attrs: UpdateAttrs) => {
    setPages((prevPages) => {
      return prevPages.map((page) =>
        page.id === id ? { ...page, ...attrs } : page
      );
    });
  };

  const onCheckPage = (id: string, selected: boolean) => {
    const checkedPages = pages.map((page) =>
      page.id === id ? { ...page, selected } : page
    );
    setPages(checkedPages);
  };

  useEffect(() => {
    getPages(account.id, account.accessToken)
      .then((data) => setPages(data))
      .catch((err) => console.log(err));
  }, []);

  const pageAllChecked = pages.every((page) => page.selected);
  const isIndeterminate =
    pages.some((page) => page.selected) && !pageAllChecked;

  return (
    <Box mt="5">
      <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <VStack align="flex-start" spacing="5">
          <FormControl id="message">
            <FormLabel htmlFor="message">Caption</FormLabel>
            <Textarea
              {...register('message')}
              placeholder="Your caption here..."
              resize="vertical"
            />
          </FormControl>
          <FormControl id="cta">
            <FormLabel htmlFor="cta">Call to Action (CTA)</FormLabel>
            <Controller
              name="cta"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  {CTA.map((cta, i) => (
                    <option key={cta.value} value={cta.value}>
                      {cta.text}
                    </option>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl id="link">
            <FormLabel htmlFor="link">Link</FormLabel>
            <Textarea
              {...register('link')}
              placeholder="Link when user click"
              resize="none"
              rows={1}
            />
            <FormHelperText>Default your page url.</FormHelperText>
          </FormControl>
          <FormControl id="ctaLinkTitle">
            <FormLabel htmlFor="ctaLinkTitle">CTA Header</FormLabel>
            <Textarea
              {...register('ctaLinkTitle')}
              placeholder="CTA Header (Optional)"
              resize="none"
              rows={1}
            />
          </FormControl>

          <FormControl id="publishedAt">
            <FormLabel>Publishing</FormLabel>
            <Controller
              name="isPublish"
              control={control}
              render={({ field: { onChange, value } }) => (
                <VStack align="stretch">
                  <ButtonGroup size="sm" variant="unstyled">
                    <Button
                      variant={value ? 'solid' : 'unstyled'}
                      onClick={() => onChange(true)}
                      _focus={{ outline: 'none' }}
                    >
                      Publish Now
                    </Button>
                    <Tooltip hasArrow label="Not implemented yet">
                      <Button
                        variant={!value ? 'solid' : 'unstyled'}
                        // onClick={() => onChange(false)}
                        _focus={{ outline: 'none' }}
                      >
                        Schedule
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                  <div>
                    {!value && (
                      <Controller
                        name="publishedAt"
                        control={control}
                        render={({ field: { value, name, onChange } }) => (
                          <DatePicker
                            id={name}
                            showTimeSelect
                            selected={value}
                            onChange={onChange}
                            showPopperArrow={true}
                            dateFormat="dd/MM/yyyy h:mm a"
                          />
                        )}
                      />
                    )}
                  </div>
                </VStack>
              )}
            />
          </FormControl>
          <VStack align="stretch" w="100%">
            <Text fontSize="md" fontWeight="medium">
              Publishing To Pages
            </Text>
            <Checkbox
              isChecked={pageAllChecked}
              isIndeterminate={isIndeterminate}
              onChange={(e) => {
                setPages((prev) =>
                  prev.map((page) => ({ ...page, selected: e.target.checked }))
                );
              }}
              fontWeight="medium"
            >
              Select All
            </Checkbox>
            <VStack align="stretch" mt={1} spacing={1}>
              {pages.map((page) => (
                <HStack justify="space-between" key={page.id} align="center">
                  <Checkbox
                    fontSize="xs"
                    isChecked={page.selected}
                    onChange={(e) => onCheckPage(page.id, e.target.checked)}
                  >
                    {page.name}
                  </Checkbox>
                  <Box>
                    {page.status === 'completed' ? (
                      <Link
                        href={page.postedUrl}
                        isExternal
                        fontSize="sm"
                        color="blue.500"
                      >
                        View Link
                      </Link>
                    ) : (
                      <Text fontSize="sm" textTransform="capitalize">
                        {page.status}
                      </Text>
                    )}
                  </Box>
                </HStack>
              ))}
            </VStack>
          </VStack>
          <Button type="submit" isLoading={loading}>
            Post
          </Button>
        </VStack>
      </chakra.form>
      {loading && (
        <Box
          w="100%"
          h="100%"
          position="absolute"
          left={0}
          top={0}
          bg="blackAlpha.200"
          display="flex"
          alignItems="flex-end"
          justifyContent="center"
          padding="5"
        >
          <Box display="flex" alignItems="center">
            <Text>{status}</Text> &nbsp; <Spinner size="sm" />
          </Box>
        </Box>
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
          <AlertDialogHeader>{error.title}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{error.message}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default PostData;
