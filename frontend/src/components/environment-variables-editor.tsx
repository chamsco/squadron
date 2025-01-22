import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import type { EnvironmentVariable } from '@/types/environment';
import { generateUUID } from '@/utils/uuid';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface Props {
  value: EnvironmentVariable[];
  onChange: (vars: EnvironmentVariable[]) => void;
}

const isSecretKey = (key: string): boolean => {
  const secretPatterns = [
    /secret/i,
    /password/i,
    /key/i,
    /token/i,
    /auth/i,
    /cert/i,
    /private/i,
    /credential/i
  ];
  return secretPatterns.some(pattern => pattern.test(key));
};

export function EnvironmentVariablesEditor({ value = [], onChange }: Props) {
  const handleAddVariable = () => {
    const newVariable: EnvironmentVariable = {
      id: generateUUID(),
      key: '',
      value: '',
      isSecret: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onChange([...value, newVariable]);
  };

  const handleRemoveVariable = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleVariableChange = (index: number, field: keyof EnvironmentVariable, newValue: string) => {
    const updatedVariables = [...value];
    updatedVariables[index] = {
      ...updatedVariables[index],
      [field]: newValue,
      isSecret: field === 'key' ? isSecretKey(newValue) : updatedVariables[index].isSecret
    };
    onChange(updatedVariables);
  };

  return (
    <div className="space-y-4">
      {value.map((variable, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="flex-1">
            <Input
              placeholder="KEY"
              value={variable.key}
              onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              type={variable.isSecret ? 'password' : 'text'}
              placeholder="VALUE"
              value={variable.value}
              onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={variable.isSecret}
              onCheckedChange={(checked) => 
                handleVariableChange(index, 'isSecret', checked ? 'true' : 'false')
              }
            />
            <Label>Secret</Label>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveVariable(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddVariable}>
        Add Variable
      </Button>
    </div>
  );
} 