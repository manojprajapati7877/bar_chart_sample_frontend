import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HOST, routes } from '../../constant';
import { toast } from 'react-toastify';

const RegistrationDropdown = ({ selectedYear, setSelectedYear }) => {
    const [years, setYears] = useState([]);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await axios.get(`${HOST}${routes.registration_dates}`)
                if (response.data?.success && response.data?.data?.years) {
                    const registrationYears = response.data?.data?.years?.map(item => item?.registration_year);
                    setYears(registrationYears);
                    if (!selectedYear) setSelectedYear(registrationYears[0] || '');
                }
            } catch (err) {
                console.error('Error fetching years:', err);
                const errorMessage =
                    err.response?.data?.message ||
                    'Failed to fetch dates. Please try again.';
                toast.error(errorMessage);
            }
        };
        fetchYears();
    }, []);

    const handleChange = (e) => {
        setSelectedYear(e.target.value);
    };

    return (
        <div>
            <label htmlFor="year-select">Select Year:</label>
            <select id="year-select" value={selectedYear} onChange={handleChange}>
                {years.map((year, idx) => (
                    <option key={idx} value={year}>{year}</option>
                ))}
            </select>
        </div>
    );
};

export default RegistrationDropdown;
