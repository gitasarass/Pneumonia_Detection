import React from 'react';

const InputForm = ({ value, onChange }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            style={{ width: '100%' }}
        />
    );
};

export default InputForm;
