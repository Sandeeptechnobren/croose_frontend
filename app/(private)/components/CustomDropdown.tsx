'use client'
import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
    value: string;
    label: string;
    title?: string;
    description?: string;
}

interface CustomDropdownProps {
    value: string | string[];
    onChange: (value: any) => void;
    options: DropdownOption[];
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    optionsClassName?: string;
    showDescriptions?: boolean;
    multiple?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    disabled = false,
    loading = false,
    className = '',
    optionsClassName = 'w-full',
    showDescriptions = false,
    multiple = false,
}) => {
    const getSelectedOptions = () => {
        if (multiple && Array.isArray(value)) {
            return options.filter((opt) => value.includes(opt.value));
        }
        return options.find((opt) => opt.value === value);
    };

    const selectedOptions = getSelectedOptions();

    const getDisplayText = () => {
        if (loading) return 'Loading...';
        if (multiple && Array.isArray(value)) {
            if (value.length === 0) return placeholder;
            if (value.length === 1) return (selectedOptions as DropdownOption[])[0]?.label;
            return `${value.length} items selected`;
        }
        return (selectedOptions as DropdownOption)?.label || placeholder;
    };

    return (
        <Listbox value={value} onChange={onChange} disabled={disabled || loading} multiple={multiple as any}>
            <div className={`relative ${className}`}>
                <Listbox.Button
                    className={`w-full flex justify-between items-center p-2.5 rounded-lg border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <span className={(multiple ? (Array.isArray(value) && value.length > 0) : value) ? 'text-black' : 'text-[#98A2B3]'}>
                        {getDisplayText()}
                    </span>
                    <ChevronDown className="text-gray-600" size={20} />
                </Listbox.Button>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className={`absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-20 ${optionsClassName}`}>
                        {options.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                value={option.value}
                                className={({ active, selected }) =>
                                    `cursor-pointer select-none flex items-center justify-between p-3 rounded-xl last:border-b-0 ${active ? 'bg-indigo-50' : 'bg-white'
                                    } ${selected ? 'bg-indigo-50/50' : ''}`
                                }
                            >
                                {({ selected }) => (
                                    <>
                                        <div>
                                            <p className={`font-medium ${selected ? 'text-indigo-600' : 'text-gray-900'}`}>
                                                {showDescriptions && option.title ? option.title : option.label}
                                            </p>
                                            {showDescriptions && option.description && (
                                                <p className="text-xs text-gray-500">{option.description}</p>
                                            )}
                                        </div>
                                        {selected && (
                                            <span className="ml-2 flex-shrink-0 text-white bg-[#685BC7] rounded-xl p-0.5">
                                                <Check size={16} />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

export default CustomDropdown;
