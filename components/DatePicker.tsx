import { Input } from '@chakra-ui/input';
import React, { FC } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

export const DatePicker: FC<ReactDatePickerProps> = (props) => {
  return <ReactDatePicker {...props} customInput={<Input />} />;
};
