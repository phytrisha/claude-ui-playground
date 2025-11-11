import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChatSettings, CLAUDE_MODELS } from '@/types/chat';

interface ChatSettingsDialogProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

export function ChatSettingsDialog({ settings, onSettingsChange }: ChatSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<ChatSettings>(settings);

  const handleChange = (field: keyof ChatSettings, value: string | number) => {
    setLocalSettings({
      ...localSettings,
      [field]: value,
    });
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setOpen(false);
  };

  const handleReset = () => {
    const defaults: ChatSettings = {
      model: 'claude-sonnet-4-5-20250929',
      temperature: 1,
      maxTokens: 4096,
      systemPrompt: '',
    };
    setLocalSettings(defaults);
  };

  // Update local settings when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setLocalSettings(settings);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Configure Claudes behavior and response characteristics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={localSettings.model} onValueChange={(value) => handleChange('model', value)}>
              <SelectTrigger className="w-full h-auto min-h-14">
                <SelectValue placeholder="Select a model">
                  {(() => {
                    const selectedModel = CLAUDE_MODELS.find(m => m.id === localSettings.model);
                    return selectedModel ? (
                      <div className="flex flex-col items-start gap-0.5 py-1">
                        <span className="font-medium text-left">{selectedModel.name}</span>
                        <span className="text-xs text-zinc-500 text-left">{selectedModel.description}</span>
                      </div>
                    ) : 'Select a model';
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CLAUDE_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span className="font-medium text-left">{model.name}</span>
                      <span className="text-xs text-zinc-500 text-left">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-zinc-500">
              Choose the Claude model that best fits your needs
            </p>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Temperature</Label>
              <span className="text-sm text-zinc-600 font-mono">
                {localSettings.temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[localSettings.temperature]}
              onValueChange={(value) => handleChange('temperature', value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Focused (0)</span>
              <span>Balanced (0.5)</span>
              <span>Creative (1)</span>
            </div>
            <p className="text-xs text-zinc-500">
              Higher values make output more random, lower values more deterministic
            </p>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input
              type="number"
              min="256"
              max="8192"
              step="256"
              value={localSettings.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-zinc-500">
              Maximum tokens in response (256-8192). Higher values allow longer responses.
            </p>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <Label>System Prompt</Label>
            <Textarea
              value={localSettings.systemPrompt}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
              placeholder="You are a helpful assistant..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-zinc-500">
              Optional instructions to customize Claudes personality and behavior
            </p>
          </div>

        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            type="button"
          >
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} type="button">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
