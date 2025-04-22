import { Box, Flex } from '@chakra-ui/react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, EditorContext, JSONContent, useEditor } from '@tiptap/react';
import { EditorMenu } from '@/components/Editor/EditorMenu.tsx';
import {
  calculateHeight,
  CommentExtension,
  focusCommentWithActiveId,
  TASK_ISSUES_ID,
} from '@/features/issue/utils.ts';
import { TaskEditorMenu } from '@/components/Editor/TaskEditorMenu.tsx';
import { Prose } from '@/components/ui/prose.tsx';
import { useLayoutEffect, useRef, useState } from 'react';
import { IssueList } from '@/features/issue/IssueList.tsx';
import { isJSON } from '@/utils/json.ts';

import './Editor.css';

export interface IEditorProps {
  originalContent: JSONString;
  onSaveClick(value: JSONContent): void;
  onCreateIssue?: () => void;
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

export function Editor({ originalContent, onSaveClick, onCreateIssue }: IEditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [rootHeight, setRootHeight] = useState('unset');
  const editorContent = originalContent && isJSON(originalContent) ? JSON.parse(originalContent) : '';

  const editor = useEditor({
    extensions,
    content: editorContent,
    editorProps: {
      attributes: {
        class: 'tiptap-content-area',
      },
    },
  });

  useLayoutEffect(() => {
    setRootHeight(calculateHeight(rootRef.current, '1.5rem'));
  }, []);

  return (
    <EditorContext.Provider value={{ editor }}>
      <Flex gap="4">
        <Box
          ref={rootRef}
          data-editor-box
          px="4"
          borderWidth="1px"
          borderColor="border.disabled"
          color="fg.disabled"
          className="tiptap"
          borderRadius="md"
          boxShadow="md"
          h={rootHeight}
          overflowY="auto"
          flexGrow="1"
        >
          <Box position="sticky" top="0px" zIndex={10}>
            <EditorMenu originalContent={originalContent} onSaveClick={onSaveClick} />
          </Box>

          <Prose width="full" maxWidth="unset" fontSize="md" h="full">
            <Flex direction="column" h="full">
              <Box h="full">
                <EditorContent className="tiptap-content-area" editor={editor}>
                  <TaskEditorMenu onCreateIssue={onCreateIssue} />
                </EditorContent>
              </Box>
            </Flex>
          </Prose>
        </Box>
        <IssueList />
      </Flex>
    </EditorContext.Provider>
  );
}
