'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toggleRef.current && !toggleRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return <div className="hidden" aria-hidden="true" />;

  const modes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="hidden" ref={toggleRef} aria-hidden="true">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 focus:outline-none flex items-center justify-center"
        aria-label="Toggle theme"
      >
          <div key={resolvedTheme}>
            {resolvedTheme === 'dark' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </div>
      </button>
 
        {isOpen && (
          <div className="menu-enter glass absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-lg border border-black/10 py-2 shadow-premium dark:border-white/5">
            {modes.map((mode) => (
              <button
                key={mode.name}
                onClick={() => {
                  setTheme(mode.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors ${
                  theme === mode.name 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <mode.icon className="w-4 h-4 mr-3" />
                {mode.label}
              </button>
            ))}
          </div>
        )}
    </div>
  );
}
