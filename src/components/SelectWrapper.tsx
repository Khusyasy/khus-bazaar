'use client';
import { useState } from 'react';
import { Select } from '@/material-tailwind';

export default function SelectWrapper({
  name,
  label,
  children,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <>
      <input
        type="hidden"
        name={name}
        value={value}
        defaultValue={defaultValue}
        required={required}
      />
      <Select label={label} value={value} onChange={(v) => setValue(v ?? '')}>
        {children}
      </Select>
    </>
  );
}
