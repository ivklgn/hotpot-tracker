import { Flex } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { JSONContent, useCurrentEditor } from '@tiptap/react';

export interface IProps {
  originalContent: JSONString;
  onSaveClick(value: JSONContent): void;
}

export function EditorFooter({ originalContent, onSaveClick }: IProps) {
  const { editor } = useCurrentEditor();

  const handleSaveSubmit = () => {
    if (!editor) return;

    onSaveClick(editor.getJSON());
  };

  const handleCancelClick = () => {
    editor?.commands.setContent(JSON.parse(originalContent));
  };

  if (!editor || originalContent === JSON.stringify(editor.getJSON())) {
    return null;
  }

  return (
    <Flex mt={4} justify="flex-end">
      <Button variant="plain" onClick={handleCancelClick}>
        Cancel
      </Button>
      <Button colorPalette="teal" onClick={handleSaveSubmit}>
        Save
      </Button>
    </Flex>
  );
}
