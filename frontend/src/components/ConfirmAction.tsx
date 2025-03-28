import { Button, PopoverFooter } from '@chakra-ui/react';
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

interface ConfirmActionProps {
  opener: React.ReactElement;
  text: string;
  onOk: () => void;
}

export const ConfirmAction: React.FC<ConfirmActionProps> = ({ opener, text, onOk }) => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <PopoverTrigger asChild>{opener}</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>{text}</PopoverBody>
        <PopoverFooter>
          <Button size="xs" onClick={onOk}>
            Ok
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </PopoverRoot>
  );
};
