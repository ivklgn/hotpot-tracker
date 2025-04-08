import { Box } from '@chakra-ui/react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import StarterKit from '@tiptap/starter-kit';
import { EditorProvider, JSONContent } from '@tiptap/react';
import { EditorMenu } from '@/components/Editor/EditorMenu.tsx';
import { EditorFooter } from '@/components/Editor/EditorFooter.tsx';
import { CommentExtension, focusCommentWithActiveId, TASK_ISSUES_ID } from '@/features/issue/utils.ts';

import './Editor.css';
import { TaskEditorMenu } from '@/components/Editor/TaskEditorMenu.tsx';
import { Prose } from '@/components/ui/prose.tsx';

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
  const editorContent = originalContent ? JSON.parse(originalContent) : '';

  console.log('editorContent', editorContent);

  return (
    <Box
      data-editor-box
      p="4"
      borderWidth="1px"
      borderColor="border.disabled"
      color="fg.disabled"
      className="tiptap"
      borderRadius="md"
      boxShadow="md"
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
