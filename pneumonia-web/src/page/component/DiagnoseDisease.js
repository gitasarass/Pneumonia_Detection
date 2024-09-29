const data = [
    { id: 1, code: '001', check: 'Tekanan Darah', type: 'text' },
    { id: 2, code: '002', check: 'Nadi', type: 'text' },
    { id: 3, code: '003', check: 'Suhu', type: 'text' },
    { id: 4, code: '004', check: 'Pernafasan', type: 'text' },
    { id: 5, code: '005', check: 'Tinggi Badan', type: 'text' },
    { id: 6, code: '006', check: 'Berat Badan', type: 'text' },
    { id: 7, code: '007', check: 'Riwayat Penyakit Hati', type: 'dropdown' },
    { id: 8, code: '008', check: 'Riwayat Penyakit Jantung Kongestif', type: 'dropdown' },
    { id: 9, code: '009', check: 'Riwayat Penyakit Ginjal', type: 'dropdown' },
    { id: 10, code: '010', check: 'Riwayat Penyakit Asma', type: 'dropdown' },
    { id: 11, code: '011', check: 'Mengalami Batuk', type: 'dropdown' },
    { id: 12, code: '012', check: 'Batuk Berdahak selama > 2-3 Minggu', type: 'dropdown' },
    { id: 13, code: '013', check: 'Batuk Berdahak', type: 'dropdown' },
    { id: 14, code: '014', check: 'Demam Tinggi', type: 'dropdown' },
    { id: 15, code: '015', check: 'Sesak Nafas dan Nyeri Dada', type: 'dropdown' },
    { id: 16, code: '016', check: 'Mual dan Muntah', type: 'dropdown' },
    { id: 17, code: '017', check: 'Kesehatan Menurun', type: 'dropdown' },
    { id: 18, code: '018', check: 'Tubuh Mulai Lelah', type: 'dropdown' },
    { id: 19, code: '019', check: 'Keringat Malam tanpa Aktivitas', type: 'dropdown' },
    { id: 20, code: '020', check: 'PH', type: 'text' },
    { id: 21, code: '021', check: 'Bloode Urea Nitrogren', type: 'text' },
    { id: 22, code: '021', check: 'Natrium', type: 'text' },
    { id: 23, code: '023', check: 'Glukosa', type: 'text' },
    { id: 24, code: '024', check: 'Hematokrit', type: 'text' },
    { id: 25, code: '025', check: 'Pao2', type: 'text' },
    { id: 26, code: '026', check: 'Sistolik', type: 'text' },
    { id: 27, code: '027', check: 'Efusi Plura', type: 'text' }
];

const diagnoseDisease = (data) => {
    const diseases = {
        Pneumonia: [
            'Mengalami Batuk',
            'Batuk Berdahak selama > 2-3 Minggu',
            'Batuk Berdahak',
            'Demam Tinggi',
            'Sesak Nafas dan Nyeri Dada',
            'Efusi Plura'
        ],
        Asma: [
            'Riwayat Penyakit Asma',
            'Sesak Nafas dan Nyeri Dada',
            'Kesehatan Menurun',
            'Tubuh Mulai Lelah'
        ],
        'Penyakit Paru Obstruktif Kronis (PPOK)': [
            'Mengalami Batuk',
            'Batuk Berdahak',
            'Sesak Nafas dan Nyeri Dada',
            'Kesehatan Menurun',
            'Tubuh Mulai Lelah'
        ],
        Tuberkulosis: [
            'Batuk Berdahak selama > 2-3 Minggu',
            'Demam Tinggi',
            'Keringat Malam tanpa Aktivitas',
            'Kesehatan Menurun',
            'Tubuh Mulai Lelah'
        ]
    };

    let diagnosis = {
        Pneumonia: [],
        Asma: [],
        PPOK: [],
        Tuberkulosis: []
    };

    data.forEach(item => {
        Object.keys(diseases).forEach(disease => {
            if (diseases[disease].includes(item.check)) {
                diagnosis[disease].push(item);
            }
        });
    });

    return diagnosis;
};