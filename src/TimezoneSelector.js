import React from 'react';
import Select from 'react-select';
import moment from 'moment-timezone';

const TimezoneSelector = ({ value, onChange }) => {
  const timezones = moment.tz.names().map(tz => ({
    value: tz,
    label: `${tz} (${moment.tz(tz).format('Z')})`,
  }));

  return (
    <div className="mb-4">
      <Select
        id="timezone"
        options={timezones}
        value={timezones.find(tz => tz.value === value)}
        onChange={(selectedOption) => onChange(selectedOption.value)}
        classNames={{
          input: (base) => 'text-xs'
        }}
        placeholder="Search for a timezone..."
      />
    </div>
  );
};

export default TimezoneSelector;
