import { Box } from '@chakra-ui/react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import StarterKit from '@tiptap/starter-kit';
import { EditorProvider, JSONContent } from '@tiptap/react';
import { EditorMenu } from '@/components/Editor/EditorMenu.tsx';
import { EditorFooter } from '@/components/Editor/EditorFooter.tsx';
import {
  calculateHeight,
  CommentExtension,
  focusCommentWithActiveId,
  TASK_ISSUES_ID,
} from '@/features/issue/utils.ts';

import './Editor.css';
import { TaskEditorMenu } from '@/components/Editor/TaskEditorMenu.tsx';
import { Prose } from '@/components/ui/prose.tsx';
import { useLayoutEffect, useRef, useState } from 'react';

export interface IProps {
  originalContent: JSONString;
  onSaveClick(value: JSONContent): void;
}

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

  CommentExtension.configure({
    HTMLAttributes: {
      class: 'issue',
    },
    onCommentActivated: (issueId) => {
      if (issueId) setTimeout(() => focusCommentWithActiveId(TASK_ISSUES_ID, issueId));
    },
  }),
];

export function Editor({ originalContent, onSaveClick }: IProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [rootHeight, setRootHeight] = useState('unset');
  const editorContent = originalContent ? JSON.parse(originalContent) : '';

  console.log('editorContent', editorContent);

  useLayoutEffect(() => {
    setRootHeight(calculateHeight(rootRef.current, '1.5rem'));
  }, []);

  return (
    <Box
      ref={rootRef}
      data-editor-box
      p="4"
      borderWidth="1px"
      borderColor="border.disabled"
      color="fg.disabled"
      className="tiptap"
      borderRadius="md"
      boxShadow="md"
      maxHeight={rootHeight}
      overflowY="auto"
    >
      <Prose width="full" maxWidth="unset" fontSize="md">
        <EditorProvider
          content={editorContent}
          slotBefore={<EditorMenu />}
          slotAfter={<EditorFooter originalContent={originalContent} onSaveClick={onSaveClick} />}
          extensions={extensions}
        >
          <TaskEditorMenu />
        </EditorProvider>
      </Prose>
    </Box>
  );
}
