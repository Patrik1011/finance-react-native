'use client';

import React from 'react';
import { Input, InputField } from '@/components/ui/input';

type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  variant?: 'outline' | 'rounded' | 'underlined';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  disabled?: boolean;
  className?: string;
};

export const SearchBar = ({
                            value,
                            onChange,
                            placeholder = 'Search...',
                            variant = 'outline',
                            size = 'md',
                            disabled = false,
                            className,
                          }: SearchBarProps) => {
  return (
    <Input variant={variant} size={size} data-disabled={disabled}>
      <InputField
        className={className}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        editable={!disabled}
      />
    </Input>
  );
};