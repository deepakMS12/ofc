"use client";

import { colors } from "@/utils/customColor";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { PhoneInput,defaultCountries, parseCountry } from 'react-international-phone';
import 'react-international-phone/style.css';

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultCountry?: string |any;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function PhoneInputField({
  value,
  onChange,
  placeholder = "Enter mobile number with country code",
  defaultCountry ,
  disabled = false,
  error = false,
  helperText,
}: PhoneInputFieldProps) {

 
   
  const [search, setSearch] = useState("");

  

  // Filter countries based on search text
  const filtered = defaultCountries.filter((country:any) =>
    country?.name?.toLowerCase().includes(search.toLowerCase())
  );
 

  // Inject styles to ensure button border matches input when focused
  useEffect(() => {
    const styleId = 'phone-input-field-focus-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Ensure button border matches input when input is focused */
      [data-phone-input-container]:focus-within button[type="button"] {
        border-color: ${error ? '#d32f2f' : colors.primary} !important;
        border-width: 2px !important;
        border-right: none !important;
      }
      [data-phone-input-container]:focus-within input[type="tel"]:not(.search-input),
      [data-phone-input-container]:focus-within input[type="text"]:not(.search-input) {
        border-color: ${error ? '#d32f2f' : colors.primary} !important;
        border-width: 2px !important;
        border-left-width: 1px !important;
      }
      /* Country selector dropdown base styles - will be overridden by JS */
      .react-international-phone-country-selector-dropdown {
        position: fixed !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [error]);

  // Auto-position dropdown based on available space
  useEffect(() => {
    const autoPositionDropdown = () => {
      const dropdown = document.querySelector('.react-international-phone-country-selector-dropdown') as HTMLElement;
      const phoneInputContainer = document.querySelector('[data-phone-input-container]') as HTMLElement;
      
      if (!dropdown || !phoneInputContainer) return;

      // Check if dropdown is visible
      const dropdownStyle = window.getComputedStyle(dropdown);
      if (dropdownStyle.display === 'none' || dropdownStyle.visibility === 'hidden') return;

      // Get viewport dimensions
      const viewportHeight = window.innerHeight;

      // Get input container position
      const containerRect = phoneInputContainer.getBoundingClientRect();
      const spaceAbove = containerRect.top;
      const spaceBelow = viewportHeight - containerRect.bottom;

      // Calculate preferred dropdown height (use 80% of viewport or available space)
      const preferredHeight = Math.min(
        Math.max(spaceAbove, spaceBelow) * 0.9,
        viewportHeight * 0.8
      );

      // Determine if we should position above or below
      const positionAbove = spaceAbove > spaceBelow;

      if (positionAbove) {
        // Position above the input
        const topPosition = Math.max(10, containerRect.top - preferredHeight - 10);
        dropdown.style.top = `${topPosition}px`;
        dropdown.style.bottom = 'auto';
        dropdown.style.height = `${containerRect.top - topPosition - 10}px`;
        dropdown.style.maxHeight = `${containerRect.top - topPosition - 10}px`;
      } else {
        // Position below the input
        const topPosition = containerRect.bottom + 10;
        dropdown.style.top = `${topPosition}px`;
        dropdown.style.bottom = 'auto';
        dropdown.style.height = `${viewportHeight - topPosition - 10}px`;
        dropdown.style.maxHeight = `${viewportHeight - topPosition - 10}px`;
      }

      // Set fixed width to 300px
      dropdown.style.width = '25%';
      dropdown.style.minWidth = '25%';
      dropdown.style.maxWidth = '25%';
      
      // Align to left edge of input
      dropdown.style.left = `${containerRect.left}px`;
      dropdown.style.right = 'auto';
      
      dropdown.style.position = 'fixed';
      dropdown.style.zIndex = '9999';
      dropdown.style.overflowY = 'auto';
    };

    // Use MutationObserver to watch for dropdown opening
    const observer = new MutationObserver(() => {
      // Small delay to ensure dropdown is fully rendered
      setTimeout(() => {
        autoPositionDropdown();
      }, 10);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also check on window resize
    const handleResize = () => {
      autoPositionDropdown();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', autoPositionDropdown, true);

    // Check immediately in case dropdown is already open
    autoPositionDropdown();

    // Also check periodically
    const interval = setInterval(() => {
      autoPositionDropdown();
    }, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', autoPositionDropdown, true);
      clearInterval(interval);
    };
  }, []);

 
  return (
    <Box
      data-phone-input-container
      sx={{
        width: '100%',
        position: 'relative',
        '& > div': {
          width: '100%',
          display: 'flex',
          alignItems: 'stretch',
        },
        // Base styles for input - target all inputs within the phone input container
        '& input[type="tel"]:not(.search-input), & input[type="text"]:not(.search-input)': {
          flex: 1,
          padding: '16.5px 14px',
          fontSize: '16px',
          fontFamily: 'inherit',
          border: error 
            ? '1px solid #d32f2f' 
            : '1px solid rgba(0, 0, 0, 0.23)',
          borderLeft: 'none',
          borderRadius: '0 4px 4px 0',
          backgroundColor: disabled ? '#fff' : '#fff',
          outline: 'none',
          transition: 'border-color 0.2s ease-in-out, border-width 0.2s ease-in-out',
          height: '56px',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'text',
          '&:disabled': {
            backgroundColor: '#fff',
            cursor: 'not-allowed',
            color: 'rgba(0, 0, 0, 0.38)',
          },
          '&::placeholder': {
            color: 'rgba(0, 0, 0, 0.6)',
            opacity: 1,
          },
        },
        // Base styles for button
        '& button[type="button"]': {
          border: error 
            ? '1px solid #d32f2f' 
            : '1px solid rgba(0, 0, 0, 0.23)',
          borderRight: 'none',
          borderRadius: '4px 0 0 4px',
          backgroundColor: disabled ? '#fff' : '#fff',
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.2s ease-in-out, border-width 0.2s ease-in-out, background-color 0.2s ease-in-out',
          minHeight: '56px',
          boxSizing: 'border-box',
          outline: 'none',
          '&:disabled': {
            backgroundColor: '#fff',
            cursor: 'not-allowed',
          },
        },
        // Hover state - when hovering over container or button, update both elements
        '&:hover button[type="button"]:not(:focus)': {
          borderColor: error 
            ? '#d32f2f' 
            : disabled 
              ? 'rgba(0, 0, 0, 0.23)' 
              : 'rgba(0, 0, 0, 0.87)',
          backgroundColor: disabled ? '#fff' : '#fff',
        },
        '&:hover input[type="tel"]:not(:focus):not(.search-input), &:hover input[type="text"]:not(:focus):not(.search-input)': {
          borderColor: error 
            ? '#d32f2f' 
            : disabled 
              ? 'rgba(0, 0, 0, 0.23)' 
              : 'rgba(0, 0, 0, 0.87)',
        },
        // Focus state - when any element is focused, update both
        // Target with high specificity to override library styles
        '&:focus-within button[type="button"]': {
          borderColor: error ? '#d32f2f' : colors.primary,
          borderWidth: '2px',
          borderRight: 'none',
        },
        '&:focus-within input[type="tel"]:not(.search-input), &:focus-within input[type="text"]:not(.search-input)': {
          borderColor: error ? '#d32f2f' : colors.primary,
          borderWidth: '2px',
          borderLeftWidth: '1px'
        },
        // Individual focus states
        '& input[type="tel"]:focus:not(.search-input), & input[type="text"]:focus:not(.search-input)': {
          borderColor: error ? '#d32f2f' : colors.primary,
          borderWidth: '2px',
          borderLeftWidth: '1px',
        },
        '& button[type="button"]:focus': {
          borderColor: error ? '#d32f2f' : colors.primary,
          borderWidth: '2px',
          borderRight: 'none',
        },
      }}
    >
      <PhoneInput
        defaultCountry={ defaultCountry  ? defaultCountry?.toLowerCase() : ""}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
//@ts-ignore
         renderCountrySelector={({ disabled, onClose, onCountrySelect }) => (
        <div className="country-menu" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          
          {/* 🔍 Search Field */}
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{
              width: "100%",
              padding: "8px",
              borderBottom: "1px solid #ddd"
            }}
          />

          {/* Country List */}
          <div className="country-list" style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {filtered.map((c) => {
              const country:any = parseCountry(c);
              return (
                <div
                  key={country.iso2}
                  className="country-item"
                  onClick={() => {
                    onCountrySelect(country);
                    onClose();
                  }}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  <img
                    src={country.flag}
                    width={20}
                    height={14}
                    alt={country.name}
                  />
                  <span>{country.name} (+{country.dialCode})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      />
      {helperText && (
        <Box
          sx={{
            mt: 0.5,
            ml: 1.75,
            fontSize: '0.75rem',
            color: error ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)',
          }}
        >
          {helperText}
        </Box>
      )}
    </Box>
  );
}

