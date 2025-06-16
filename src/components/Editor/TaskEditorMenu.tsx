import { BubbleMenu, useCurrentEditor } from '@tiptap/react';
import { LuBold, LuItalic, LuListPlus, LuStrikethrough } from 'react-icons/lu';
import { EditorButton } from '@/components/Editor/EditorButton.tsx';
import { Box, Flex, Separator } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { CreateIssueDialog } from '@/features/issue/CreateIssueDialog.tsx';
import { useParams } from 'wouter';

import './Editor.css';

interface TaskEditorMenu {
  onCreateInlineIssue?: () => void;
}

export function TaskEditorMenu({ onCreateInlineIssue }: TaskEditorMenu) {
  const { editor } = useCurrentEditor();
  const params = useParams();

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
      <Box boxShadow="sm" bg="bg.muted" py="2" px="3" rounded="md">
        <Flex>
          <Flex gap="1.5" mr="3">
            <EditorButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <LuBold />
            </EditorButton>

            <EditorButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <LuItalic />
            </EditorButton>

            <EditorButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strike"
            >
              <LuStrikethrough />
            </EditorButton>
          </Flex>

          <Separator orientation="vertical" />

          <CreateIssueDialog
            taskId={params?.taskId as string}
            opener={
              <Box pl="3">
                <Button size="xs" colorPalette="teal">
                  <LuListPlus /> Add issue
                </Button>
              </Box>
            }
            onCreate={onCreateInlineIssue}
          />
        </Flex>
      </Box>
    </BubbleMenu>
  );
}
