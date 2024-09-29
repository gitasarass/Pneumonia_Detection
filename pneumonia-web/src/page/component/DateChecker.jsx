import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const DateChecker = () => (
    <DatePicker
    defaultValue={dayjs('2024-06-05', dateFormat)}
    minDate={dayjs('2020-01-01', dateFormat)}
    maxDate={dayjs('2054-12-31', dateFormat)}
  />
)

export default DateChecker