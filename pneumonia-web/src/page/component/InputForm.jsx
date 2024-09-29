import React from 'react';

const InputForm = ({ value, onChange }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            className='custom-input-form'
        />
    );
};

export default InputForm;
