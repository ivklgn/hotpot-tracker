import { JSONContent, useCurrentEditor } from '@tiptap/react';
import './Editor.css';
import { Flex, Box } from '@chakra-ui/react';
import {
  LuBold,
  LuCode,
  LuItalic,
  LuList,
  LuListOrdered,
  LuMessageSquareCode,
  LuRedo2,
  LuSave,
  LuSquareCode,
  LuStrikethrough,
  LuUndo2,
} from 'react-icons/lu';
import { EditorButton } from './EditorButton';
import { FontSizeSelector } from '@/components/Editor/FontSizeSelector.tsx';

interface EditorMenuProps {
  originalContent: string;
  onSaveClick?: (value: JSONContent) => void;
}

export function EditorMenu({ originalContent, onSaveClick }: EditorMenuProps) {
  const { editor } = useCurrentEditor();

  const handleSaveSubmit = () => {
    if (!editor) return;
    onSaveClick?.(editor.getJSON());
  };

  const isContentDirty = !!editor && originalContent !== JSON.stringify(editor.getJSON());

  if (!editor) {
    return null;
  }

  return (
    <Box
      py="3"
      px="4"
      style={{ marginLeft: '-1rem', marginRight: '-1rem' }}
      bg={{ _light: 'white', _dark: 'gray.800' }}
    >
      <Flex gap="2">
        <EditorButton onClick={handleSaveSubmit} title="Save" colorPalette={isContentDirty ? 'teal' : 'gray'}>
          <LuSave />
        </EditorButton>

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

        <EditorButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Code"
        >
          <LuCode />
        </EditorButton>

        <FontSizeSelector />

        <EditorButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <LuList />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered list"
        >
          <LuListOrdered />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code block"
        >
          <LuSquareCode />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <LuMessageSquareCode />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        >
          <LuUndo2 />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        >
          <LuRedo2 />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        >
          Purple
        </EditorButton>
      </Flex>
    </Box>
  );
}
