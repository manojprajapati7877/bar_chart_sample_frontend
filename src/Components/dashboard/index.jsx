import React, { useState } from 'react';
import RegistrationDropdown from '../registrationDropdown';
import BarChart from '../barChart';

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState('');
  return (
    <div>
      <RegistrationDropdown selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      {selectedYear && <BarChart selectedYear={selectedYear} />}
    </div>
  );
};

export default Dashboard;
