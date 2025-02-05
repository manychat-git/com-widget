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
    <div className="com-fixed com-top-4 com-left-4 com-w-80 com-bg-white/90 com-backdrop-blur-sm com-rounded-lg com-shadow-lg com-p-4 com-max-h-[80vh] com-overflow-y-auto">
      <div className="com-flex com-justify-between com-items-center com-mb-4">
        <h2 className="com-text-lg com-font-semibold">Link Connections</h2>
        <button
          onClick={handleReset}
          className="com-px-3 com-py-1 com-text-sm com-text-gray-600 hover:com-text-gray-900 com-border com-border-gray-300 com-rounded-md hover:com-bg-gray-50 com-transition-colors"
        >
          Reset
        </button>
      </div>
      
      {/* Type Links */}
      <div className="com-mb-6">
        <div className="com-flex com-items-center com-justify-between com-mb-2">
          <div>
            <h3 className="com-font-medium">Content Type</h3>
            <p className="com-text-sm com-text-gray-500">Link by content (articles, videos, etc)</p>
          </div>
          <Switch
            checked={settings.type.enabled}
            onChange={(checked) => handleSettingChange('type', 'enabled', checked)}
            className={`${
              settings.type.enabled ? 'com-bg-green-500' : 'com-bg-gray-200'
            } com-relative com-inline-flex com-h-6 com-w-11 com-items-center com-rounded-full com-transition-colors focus:com-outline-none`}
          >
            <span
              className={`${
                settings.type.enabled ? 'com-translate-x-6' : 'com-translate-x-1'
              } com-inline-block com-h-4 com-w-4 com-transform com-rounded-full com-bg-white com-transition-transform`}
            />
          </Switch>
        </div>
        
        <div className="com-space-y-2">
          <div>
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Strength</span>
              <span className="com-text-sm com-text-gray-500">{settings.type.strength.toFixed(1)}</span>
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
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Distance</span>
              <span className="com-text-sm com-text-gray-500">{settings.type.distance}</span>
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
      <div className="com-mb-6">
        <div className="com-flex com-items-center com-justify-between com-mb-2">
          <div>
            <h3 className="com-font-medium">Author</h3>
            <p className="com-text-sm com-text-gray-500">Link by same author</p>
          </div>
          <Switch
            checked={settings.author.enabled}
            onChange={(checked) => handleSettingChange('author', 'enabled', checked)}
            className={`${
              settings.author.enabled ? 'com-bg-green-500' : 'com-bg-gray-200'
            } com-relative com-inline-flex com-h-6 com-w-11 com-items-center com-rounded-full com-transition-colors focus:com-outline-none`}
          >
            <span
              className={`${
                settings.author.enabled ? 'com-translate-x-6' : 'com-translate-x-1'
              } com-inline-block com-h-4 com-w-4 com-transform com-rounded-full com-bg-white com-transition-transform`}
            />
          </Switch>
        </div>
        
        <div className="com-space-y-2">
          <div>
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Strength</span>
              <span className="com-text-sm com-text-gray-500">{settings.author.strength.toFixed(1)}</span>
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
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Distance</span>
              <span className="com-text-sm com-text-gray-500">{settings.author.distance}</span>
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
      <div className="com-mb-6">
        <div className="com-flex com-items-center com-justify-between com-mb-2">
          <div>
            <h3 className="com-font-medium">Issue</h3>
            <p className="com-text-sm com-text-gray-500">Link by same issue</p>
          </div>
          <Switch
            checked={settings.issue.enabled}
            onChange={(checked) => handleSettingChange('issue', 'enabled', checked)}
            className={`${
              settings.issue.enabled ? 'com-bg-green-500' : 'com-bg-gray-200'
            } com-relative com-inline-flex com-h-6 com-w-11 com-items-center com-rounded-full com-transition-colors focus:com-outline-none`}
          >
            <span
              className={`${
                settings.issue.enabled ? 'com-translate-x-6' : 'com-translate-x-1'
              } com-inline-block com-h-4 com-w-4 com-transform com-rounded-full com-bg-white com-transition-transform`}
            />
          </Switch>
        </div>
        
        <div className="com-space-y-2">
          <div>
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Strength</span>
              <span className="com-text-sm com-text-gray-500">{settings.issue.strength.toFixed(1)}</span>
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
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Distance</span>
              <span className="com-text-sm com-text-gray-500">{settings.issue.distance}</span>
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
      <Separator className="com-my-6" />
      <div className="com-mb-6">
        <div className="com-mb-4">
          <h3 className="com-font-medium">Visual Settings</h3>
          <p className="com-text-sm com-text-gray-500">Customize link appearance</p>
        </div>
        
        <div className="com-space-y-4">
          <div>
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Line Width</span>
              <span className="com-text-sm com-text-gray-500">{settings.visual.width.toFixed(1)}</span>
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
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Line Opacity</span>
              <span className="com-text-sm com-text-gray-500">{settings.visual.opacity.toFixed(1)}</span>
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
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Line Color</span>
              <input
                type="color"
                value={settings.visual.color}
                onChange={(e) => handleVisualChange('color', e.target.value)}
                className="com-w-8 com-h-8 com-rounded com-cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Physics Settings */}
      <Separator className="com-my-6" />
      <div className="com-mb-6">
        <div className="com-mb-4">
          <h3 className="com-font-medium">Repulsion</h3>
          <p className="com-text-sm com-text-gray-500">Node repulsion force settings</p>
        </div>
        
        <div className="com-space-y-4">
          <div>
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Strength</span>
              <span className="com-text-sm com-text-gray-500">{settings.physics.repulsion.strength}</span>
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
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Max Distance</span>
              <span className="com-text-sm com-text-gray-500">{settings.physics.repulsion.maxDistance}</span>
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

      <div className="com-mb-6">
        <div className="com-mb-4">
          <h3 className="com-font-medium">Collision</h3>
          <p className="com-text-sm com-text-gray-500">Node collision settings</p>
        </div>
        
        <div className="com-space-y-4">
          <div>
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Radius</span>
              <span className="com-text-sm com-text-gray-500">{settings.physics.collision.radius}</span>
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
            <div className="com-flex com-justify-between com-mb-0.5">
              <span className="com-text-sm">Strength</span>
              <span className="com-text-sm com-text-gray-500">{settings.physics.collision.strength.toFixed(1)}</span>
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

      <div className="com-mb-6">
        <div className="com-flex com-items-center com-justify-between com-mb-2">
          <div>
            <h3 className="com-font-medium">Center Gravity</h3>
            <p className="com-text-sm com-text-gray-500">Pull nodes to center</p>
          </div>
          <Switch
            checked={settings.physics.centerForce}
            onChange={handleCenterForceChange}
            className={`${
              settings.physics.centerForce ? 'com-bg-green-500' : 'com-bg-gray-200'
            } com-relative com-inline-flex com-h-6 com-w-11 com-items-center com-rounded-full com-transition-colors focus:com-outline-none`}
          >
            <span
              className={`${
                settings.physics.centerForce ? 'com-translate-x-6' : 'com-translate-x-1'
              } com-inline-block com-h-4 com-w-4 com-transform com-rounded-full com-bg-white com-transition-transform`}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default GraphSettingsPanel; 