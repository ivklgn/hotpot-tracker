import { Box } from '@chakra-ui/react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import StarterKit from '@tiptap/starter-kit';
import { EditorProvider } from '@tiptap/react';
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
  initialContent: string;
}

export function Editor({ initialContent }: IProps) {
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
        content={initialContent}
        slotBefore={<EditorMenu />}
        slotAfter={<EditorFooter />}
        extensions={extensions}
      />
    </Box>
  );
}
