import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Slider } from '@mui/material';
import { DEFAULT_LINK_SETTINGS, LinkSettings } from './graphUtils';

interface GraphSettingsPanelProps {
  onSettingsChange: (settings: LinkSettings) => void;
}

const GraphSettingsPanel: React.FC<GraphSettingsPanelProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState(DEFAULT_LINK_SETTINGS);

  const handleSettingChange = (
    category: 'type' | 'author' | 'issue',
    field: keyof LinkSettings[keyof LinkSettings],
    value: number | boolean
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleReset = () => {
    setSettings(DEFAULT_LINK_SETTINGS);
    onSettingsChange(DEFAULT_LINK_SETTINGS);
  };

  return (
    <div className="fixed top-4 left-4 w-80 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-h-[50vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Link Connections</h2>
        <button
          onClick={handleReset}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
      
      {/* Type Links */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">Type</h3>
            <p className="text-sm text-gray-500">Link by content type</p>
          </div>
          <Switch
            checked={settings.type.enabled}
            onChange={(checked) => handleSettingChange('type', 'enabled', checked)}
            className={`${
              settings.type.enabled ? 'bg-green-500' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${
                settings.type.enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Strength</span>
              <span className="text-sm text-gray-500">{settings.type.strength.toFixed(1)}</span>
            </div>
            <Slider
              disabled={!settings.type.enabled}
              value={settings.type.strength}
              onChange={(_, value) => handleSettingChange('type', 'strength', value as number)}
              min={0}
              max={1}
              step={0.1}
              sx={{ color: '#000000' }}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Distance</span>
              <span className="text-sm text-gray-500">{settings.type.distance}</span>
            </div>
            <Slider
              disabled={!settings.type.enabled}
              value={settings.type.distance}
              onChange={(_, value) => handleSettingChange('type', 'distance', value as number)}
              min={0}
              max={200}
              step={20}
              sx={{ color: '#000000' }}
            />
          </div>
        </div>
      </div>

      {/* Author Links */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">Author</h3>
            <p className="text-sm text-gray-500">Link by same author</p>
          </div>
          <Switch
            checked={settings.author.enabled}
            onChange={(checked) => handleSettingChange('author', 'enabled', checked)}
            className={`${
              settings.author.enabled ? 'bg-green-500' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${
                settings.author.enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Strength</span>
              <span className="text-sm text-gray-500">{settings.author.strength.toFixed(1)}</span>
            </div>
            <Slider
              disabled={!settings.author.enabled}
              value={settings.author.strength}
              onChange={(_, value) => handleSettingChange('author', 'strength', value as number)}
              min={0}
              max={1}
              step={0.1}
              sx={{ color: '#000000' }}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Distance</span>
              <span className="text-sm text-gray-500">{settings.author.distance}</span>
            </div>
            <Slider
              disabled={!settings.author.enabled}
              value={settings.author.distance}
              onChange={(_, value) => handleSettingChange('author', 'distance', value as number)}
              min={0}
              max={200}
              step={20}
              sx={{ color: '#000000' }}
            />
          </div>
        </div>
      </div>

      {/* Issue Links */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">Issue</h3>
            <p className="text-sm text-gray-500">Link by same issue</p>
          </div>
          <Switch
            checked={settings.issue.enabled}
            onChange={(checked) => handleSettingChange('issue', 'enabled', checked)}
            className={`${
              settings.issue.enabled ? 'bg-green-500' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${
                settings.issue.enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Strength</span>
              <span className="text-sm text-gray-500">{settings.issue.strength.toFixed(1)}</span>
            </div>
            <Slider
              disabled={!settings.issue.enabled}
              value={settings.issue.strength}
              onChange={(_, value) => handleSettingChange('issue', 'strength', value as number)}
              min={0}
              max={1}
              step={0.1}
              sx={{ color: '#000000' }}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Distance</span>
              <span className="text-sm text-gray-500">{settings.issue.distance}</span>
            </div>
            <Slider
              disabled={!settings.issue.enabled}
              value={settings.issue.distance}
              onChange={(_, value) => handleSettingChange('issue', 'distance', value as number)}
              min={0}
              max={200}
              step={20}
              sx={{ color: '#000000' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphSettingsPanel; 