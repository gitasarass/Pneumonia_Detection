import React from 'react';

const DropdownForm = ({ value, onChange }) => {
    const options = ["ya", "tidak"];
    return (
        <select value={value} onChange={onChange} className="custom-select" aria-label="Pilih Keterangan">
            <option value="" disabled>Pilih Keterangan</option>
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    );
};

export default DropdownForm;
