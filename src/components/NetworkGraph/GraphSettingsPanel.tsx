import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Slider } from '@mui/material';
import { DEFAULT_LINK_SETTINGS, LinkSettings } from './graphUtils';
import { Separator } from '../ui/separator';

interface GraphSettingsPanelProps {
  settings: LinkSettings;
  onSettingsChange: (settings: LinkSettings) => void;
}

const GraphSettingsPanel: React.FC<GraphSettingsPanelProps> = ({ settings, onSettingsChange }) => {
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
    onSettingsChange(newSettings);
  };

  const handleVisualChange = (
    field: keyof LinkSettings['visual'],
    value: number | string
  ) => {
    const newSettings = {
      ...settings,
      visual: {
        ...settings.visual,
        [field]: value
      }
    };
    onSettingsChange(newSettings);
  };

  const handlePhysicsChange = (
    category: 'repulsion' | 'collision',
    field: string,
    value: number
  ) => {
    const newSettings = {
      ...settings,
      physics: {
        ...settings.physics,
        [category]: {
          ...settings.physics[category],
          [field]: value
        }
      }
    };
    onSettingsChange(newSettings);
  };

  const handleCenterForceChange = (checked: boolean) => {
    const newSettings = {
      ...settings,
      physics: {
        ...settings.physics,
        centerForce: checked
      }
    };
    onSettingsChange(newSettings);
  };

  const handleReset = () => {
    onSettingsChange(DEFAULT_LINK_SETTINGS);
  };

  return (
    <div className="fixed top-4 left-4 w-80 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-h-[80vh] overflow-y-auto">
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
            <h3 className="font-medium">Content Type</h3>
            <p className="text-sm text-gray-500">Link by content (articles, videos, etc)</p>
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

      {/* Visual Settings */}
      <Separator className="my-6" />
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="font-medium">Visual Settings</h3>
          <p className="text-sm text-gray-500">Customize link appearance</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Line Width</span>
              <span className="text-sm text-gray-500">{settings.visual.width.toFixed(1)}</span>
            </div>
            <Slider
              value={settings.visual.width}
              onChange={(_, value) => handleVisualChange('width', value as number)}
              min={0.1}
              max={1.0}
              step={0.1}
              sx={{ color: '#000000' }}
            />
          </div>

          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Line Opacity</span>
              <span className="text-sm text-gray-500">{settings.visual.opacity.toFixed(1)}</span>
            </div>
            <Slider
              value={settings.visual.opacity}
              onChange={(_, value) => handleVisualChange('opacity', value as number)}
              min={0}
              max={1}
              step={0.1}
              sx={{ color: '#000000' }}
            />
          </div>

          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Line Color</span>
              <input
                type="color"
                value={settings.visual.color}
                onChange={(e) => handleVisualChange('color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Physics Settings */}
      <Separator className="my-6" />
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="font-medium">Repulsion</h3>
          <p className="text-sm text-gray-500">Node repulsion force settings</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Strength</span>
              <span className="text-sm text-gray-500">{settings.physics.repulsion.strength}</span>
            </div>
            <Slider
              value={settings.physics.repulsion.strength}
              onChange={(_, value) => handlePhysicsChange('repulsion', 'strength', value as number)}
              min={-1000}
              max={0}
              step={50}
              sx={{ color: '#000000' }}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Max Distance</span>
              <span className="text-sm text-gray-500">{settings.physics.repulsion.maxDistance}</span>
            </div>
            <Slider
              value={settings.physics.repulsion.maxDistance}
              onChange={(_, value) => handlePhysicsChange('repulsion', 'maxDistance', value as number)}
              min={1}
              max={500}
              step={10}
              sx={{ color: '#000000' }}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-4">
          <h3 className="font-medium">Collision</h3>
          <p className="text-sm text-gray-500">Node collision settings</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Radius</span>
              <span className="text-sm text-gray-500">{settings.physics.collision.radius}</span>
            </div>
            <Slider
              value={settings.physics.collision.radius}
              onChange={(_, value) => handlePhysicsChange('collision', 'radius', value as number)}
              min={1}
              max={100}
              step={1}
              sx={{ color: '#000000' }}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-sm">Strength</span>
              <span className="text-sm text-gray-500">{settings.physics.collision.strength.toFixed(1)}</span>
            </div>
            <Slider
              value={settings.physics.collision.strength}
              onChange={(_, value) => handlePhysicsChange('collision', 'strength', value as number)}
              min={0}
              max={1}
              step={0.1}
              sx={{ color: '#000000' }}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">Center Gravity</h3>
            <p className="text-sm text-gray-500">Pull nodes to center</p>
          </div>
          <Switch
            checked={settings.physics.centerForce}
            onChange={handleCenterForceChange}
            className={`${
              settings.physics.centerForce ? 'bg-green-500' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${
                settings.physics.centerForce ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default GraphSettingsPanel; 