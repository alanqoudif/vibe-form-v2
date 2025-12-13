"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { 
  FormTheme, 
  THEME_PRESETS, 
  COLOR_PALETTE, 
  BACKGROUND_COLORS,
  FontFamily,
  DEFAULT_THEME 
} from '@/types/form-theme';
import { 
  Palette, 
  Type, 
  Image, 
  Check, 
  ChevronDown,
  Paintbrush,
  Square,
  Sparkles
} from 'lucide-react';

interface ThemePickerProps {
  theme: FormTheme;
  onChange: (theme: FormTheme) => void;
}

const FONTS: { value: FontFamily; label: string; style?: string }[] = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Cairo', label: 'Cairo', style: 'Arabic' },
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Arabic', style: 'Arabic' },
];

export function ThemePicker({ theme, onChange }: ThemePickerProps) {
  const t = useTranslations('FormBuilder');
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'typography'>('presets');

  const handlePresetSelect = (presetKey: string) => {
    onChange(THEME_PRESETS[presetKey]);
  };

  const handleColorChange = (key: keyof FormTheme, value: string) => {
    onChange({ ...theme, [key]: value });
  };

  const handleFontChange = (font: FontFamily) => {
    onChange({ ...theme, fontFamily: font });
  };

  const tabs = [
    { id: 'presets', label: t('themePresets') || 'Presets', icon: Sparkles },
    { id: 'colors', label: t('themeColors') || 'Colors', icon: Palette },
    { id: 'typography', label: t('themeTypography') || 'Typography', icon: Type },
  ] as const;

  return (
    <div className="w-full space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-black/20 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Presets Tab */}
      {activeTab === 'presets' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">{t('selectPreset') || 'Choose a theme preset'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(THEME_PRESETS).map(([key, preset]) => {
              const isSelected = 
                theme.primaryColor === preset.primaryColor && 
                theme.backgroundColor === preset.backgroundColor;
              
              return (
                <button
                  key={key}
                  onClick={() => handlePresetSelect(key)}
                  className={cn(
                    "relative group p-3 rounded-xl border-2 transition-all duration-200 overflow-hidden",
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500/30"
                      : "border-white/10 hover:border-white/30"
                  )}
                  style={{ backgroundColor: preset.backgroundColor }}
                >
                  {/* Header Bar */}
                  <div 
                    className="h-8 rounded-lg mb-2"
                    style={{ backgroundColor: preset.headerColor }}
                  />
                  
                  {/* Mock Content */}
                  <div 
                    className="p-2 rounded-md space-y-1.5"
                    style={{ backgroundColor: preset.cardBackground }}
                  >
                    <div 
                      className="h-2 w-3/4 rounded"
                      style={{ backgroundColor: preset.questionTextColor, opacity: 0.8 }}
                    />
                    <div 
                      className="h-1.5 w-1/2 rounded"
                      style={{ backgroundColor: preset.answerTextColor, opacity: 0.5 }}
                    />
                    <div 
                      className="h-4 w-full rounded mt-2"
                      style={{ 
                        border: `1px solid ${preset.primaryColor}40`,
                        backgroundColor: preset.primaryColor + '10'
                      }}
                    />
                  </div>

                  {/* Selection Check */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Preset Name */}
                  <p 
                    className="text-xs font-medium mt-2 capitalize"
                    style={{ color: preset.questionTextColor }}
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-5">
          {/* Primary Color */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Paintbrush className="w-4 h-4" />
              {t('primaryColor') || 'Primary Color'}
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange('primaryColor', color)}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110",
                    theme.primaryColor === color
                      ? "border-white ring-2 ring-white/30 scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
              {/* Custom color input */}
              <div className="relative">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer opacity-0 absolute inset-0"
                />
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${theme.primaryColor} 50%, transparent 50%)` }}
                >
                  <span className="text-[10px] text-gray-400">+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header Color */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Square className="w-4 h-4" />
              {t('headerColor') || 'Header Color'}
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.slice(0, 10).map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange('headerColor', color)}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110",
                    theme.headerColor === color
                      ? "border-white ring-2 ring-white/30 scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Image className="w-4 h-4" />
              {t('backgroundColor') || 'Background Color'}
            </label>
            <div className="flex flex-wrap gap-2">
              {BACKGROUND_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange('backgroundColor', color)}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110",
                    theme.backgroundColor === color
                      ? "border-blue-500 ring-2 ring-blue-500/30 scale-110"
                      : "border-gray-600"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Card Style */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                {t('borderRadius') || 'Corner Radius'}
              </label>
              <select
                value={theme.cardBorderRadius}
                onChange={(e) => handleColorChange('cardBorderRadius', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                {t('cardShadow') || 'Shadow'}
              </label>
              <select
                value={theme.cardShadow}
                onChange={(e) => handleColorChange('cardShadow', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              {t('fontFamily') || 'Font Family'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FONTS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => handleFontChange(font.value)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg border text-left transition-all",
                    theme.fontFamily === font.value
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                  )}
                  style={{ fontFamily: `"${font.value}", sans-serif` }}
                >
                  <span className="text-sm">{font.label}</span>
                  {font.style && (
                    <span className="text-xs text-gray-500 ml-2">({font.style})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Text Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                {t('questionTextColor') || 'Question Text'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.questionTextColor}
                  onChange={(e) => handleColorChange('questionTextColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.questionTextColor}
                  onChange={(e) => handleColorChange('questionTextColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                {t('answerTextColor') || 'Answer Text'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.answerTextColor}
                  onChange={(e) => handleColorChange('answerTextColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.answerTextColor}
                  onChange={(e) => handleColorChange('answerTextColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mini theme preview for toolbar
export function ThemePreview({ theme }: { theme: FormTheme }) {
  return (
    <div 
      className="w-16 h-12 rounded-md overflow-hidden border border-white/10"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div 
        className="h-3"
        style={{ backgroundColor: theme.headerColor }}
      />
      <div className="p-1">
        <div 
          className="h-1.5 w-3/4 rounded mb-1"
          style={{ backgroundColor: theme.questionTextColor, opacity: 0.8 }}
        />
        <div 
          className="h-2 w-full rounded"
          style={{ 
            border: `1px solid ${theme.primaryColor}`,
            backgroundColor: theme.primaryColor + '20'
          }}
        />
      </div>
    </div>
  );
}






