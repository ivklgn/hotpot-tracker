import { Fieldset, HStack, IconButton, Input, Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogCloseTrigger,
} from '@/components/ui/dialog';
import { Select } from 'chakra-react-select';
import { cloneElement, useRef, useState } from 'react';
import React from 'react';
import { LuPlus, LuX } from 'react-icons/lu';
import { id } from '@instantdb/react';

const SMART_PARAMS_TYPES = [
  {
    value: 'string',
    label: 'String',
  },
  {
    value: 'number',
    label: 'Number',
  },
  {
    value: 'time',
    label: 'Time',
  },
  {
    value: 'date',
    label: 'Date',
  },
  // {
  //   value: 'date-range',
  //   label: 'Date range',
  // },
];

interface SmartParam {
  id: string;
  name: string;
  type: string;
  value?: string;
}
interface SmartParamsDialogProps {
  opener: React.ReactElement;
}

export const SmartParamsDialog: React.FC<SmartParamsDialogProps> = ({ opener }) => {
  const [smartParams, setSmartParams] = useState<SmartParam[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const [isVisible, setVisibility] = useState(false);
  // const { currentTeamId } = useAccount();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleAddParamClick = () => {
    setSmartParams((prev) => [...prev, { id: id(), name: '', type: 'string', value: '' }]);
  };

  const handleDeleteParamClick = (id: string) => {
    setSmartParams((prev) => prev.filter((param) => param.id !== id));
  };

  const handleChangeParam = (id: string, fieldName: keyof SmartParam, fieldValue?: string) => {
    setSmartParams((prev) => {
      return prev.map((param) => {
        if (param.id === id) {
          return { ...param, [fieldName]: fieldValue };
        }
        return param;
      });
    });
  };

  return (
    <DialogRoot initialFocusEl={() => ref.current} open={isVisible} size="lg">
      <DialogTrigger asChild>
        {cloneElement(opener, {
          ref,
          onClick: () => {
            setVisibility(true);
          },
        })}
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogCloseTrigger onClick={() => setVisibility(false)} />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add or edit smart params</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Fieldset.Root size="sm">
              <Fieldset.Content>
                {smartParams.length === 0 && <Text>No params, click to add params</Text>}
                {smartParams.length > 0 &&
                  Object.entries(smartParams).map(([name, param]) => (
                    <ParamField
                      key={name}
                      param={param}
                      onDelete={handleDeleteParamClick}
                      onChange={handleChangeParam}
                    />
                  ))}
              </Fieldset.Content>
            </Fieldset.Root>
          </DialogBody>
          <DialogFooter justifyContent="space-between">
            <IconButton aria-label="Create task" variant="plain" size="xs" onClick={handleAddParamClick}>
              <LuPlus /> Add param
            </IconButton>
            <HStack>
              <DialogActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setVisibility(false);
                  }}
                  size="xs"
                >
                  Cancel
                </Button>
              </DialogActionTrigger>
              <Button type="submit" size="xs">
                Save
              </Button>
            </HStack>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

function ParamField({
  param,
  onDelete,
  onChange,
}: {
  param: SmartParam;
  onDelete?: (id: string) => void;
  onChange?: (id: string, fieldName: keyof SmartParam, fieldValue?: string) => void;
}) {
  return (
    <div key={param.id}>
      <HStack>
        <Input
          name="name"
          placeholder="Name"
          size="sm"
          onChange={(e) => onChange?.(param.id, 'name', e.target.value)}
          value={param.name}
          maxW="160px"
        />
        <Select
          options={SMART_PARAMS_TYPES}
          placeholder="Type"
          size="sm"
          onChange={(newValue) => onChange?.(param.id, 'type', newValue?.value)}
          value={{
            value: param.type,
            label: SMART_PARAMS_TYPES.find((type) => type.value === param.type)?.label,
          }}
          styles={{
            control: (base) => ({
              ...base,
              minWidth: '100px',
            }),
          }}
        />
        {param.type === 'string' && (
          <Input
            name="value"
            placeholder="value"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={param.value}
            type="text"
          />
        )}
        {param.type === 'number' && (
          <Input
            name="value"
            placeholder="10"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={param.value}
            type="number"
          />
        )}
        {param.type === 'time' && (
          <Input
            placeholder="1w 2d"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={param.value}
            type="text"
          />
        )}
        {param.type === 'date' && (
          <Input
            name="value"
            placeholder="19.02.2028"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={param.value}
            type="date"
          />
        )}
        <IconButton
          aria-label="Delete param"
          variant="plain"
          size="xs"
          onClick={() => {
            onDelete?.(param.id);
          }}
        >
          <LuX />
        </IconButton>
      </HStack>
    </div>
  );
}
