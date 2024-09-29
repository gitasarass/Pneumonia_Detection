import React from 'react'
import { Select } from 'antd'

const handleChange = (value) => {
    console.log(value)
}


const SelectItem = () => (
    <Select
      labelInValue
      defaultValue={{
        value: 'Semua',
        label: 'Semua',
      }}
      style={{
        width: 120,
      }}
      onChange={handleChange}
      options={[
        {
            value: 'Semua',
            label: 'Semua',
        },
        {
          value: 'Cek Kesehatan',
          label: 'Cek Kesehatan',
        },
        {
          value: 'Cek Pneumonia',
          label: 'Cek Pneumonia',
        },
      ]}
    />
  );

export default SelectItem