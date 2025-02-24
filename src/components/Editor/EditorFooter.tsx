import { Flex } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { useCurrentEditor } from '@tiptap/react';

export function EditorFooter() {
  const { editor } = useCurrentEditor();

  if (!editor || !editor?.getText().length) {
    return null;
  }

  return (
    <Flex mt={4} justify="flex-end">
      <Button variant="plain">Cancel</Button>
      <Button colorPalette="teal">Save</Button>
    </Flex>
  );
}
