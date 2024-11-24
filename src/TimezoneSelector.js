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
      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
        Timezone
      </label>
      <Select
        id="timezone"
        options={timezones}
        value={timezones.find(tz => tz.value === value)}
        onChange={(selectedOption) => onChange(selectedOption.value)}
        className="mt-1 block w-full"
        classNamePrefix="react-select"
        placeholder="Search for a timezone..."
      />
    </div>
  );
};

export default TimezoneSelector;
