import { Box } from '@chakra-ui/react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import StarterKit from '@tiptap/starter-kit';
import { EditorProvider, JSONContent } from '@tiptap/react';
import { EditorMenu } from '@/components/Editor/EditorMenu.tsx';
import { EditorFooter } from '@/components/Editor/EditorFooter.tsx';

import './Editor.css';

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure(),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

export interface IProps {
  originalContent: JSONString;
  onSaveClick(value: JSONContent): void;
}

export function Editor({ originalContent, onSaveClick }: IProps) {
  const editorContent = originalContent ? JSON.parse(originalContent) : '';

  return (
    <Box
      p="4"
      borderWidth="1px"
      borderColor="border.disabled"
      color="fg.disabled"
      className="tiptap"
      borderRadius="md"
    >
      <EditorProvider
        content={editorContent}
        slotBefore={<EditorMenu />}
        slotAfter={<EditorFooter originalContent={originalContent} onSaveClick={onSaveClick} />}
        extensions={extensions}
      />
    </Box>
  );
}
