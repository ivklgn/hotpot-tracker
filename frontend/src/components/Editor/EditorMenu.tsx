import { useCurrentEditor } from '@tiptap/react';
import './Editor.css';
import { Flex, Box } from '@chakra-ui/react';
import {
  LuBold,
  LuCode,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuItalic,
  LuList,
  LuListOrdered,
  LuMessageSquareCode,
  LuPilcrow,
  LuRedo2,
  LuSquareCode,
  LuStrikethrough,
  LuUndo2,
} from 'react-icons/lu';
import { EditorButton } from './EditorButton';

export function EditorMenu() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <Box mb="4">
      <Flex gap="2">
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

        <EditorButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title="Paragraph"
        >
          <LuPilcrow />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <LuHeading1 />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <LuHeading2 />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <LuHeading3 />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          isActive={editor.isActive('heading', { level: 4 })}
          title="Heading 4"
        >
          <LuHeading4 />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          isActive={editor.isActive('heading', { level: 5 })}
          title="Heading 5"
        >
          <LuHeading5 />
        </EditorButton>

        <EditorButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          isActive={editor.isActive('heading', { level: 6 })}
          title="Heading 6"
        >
          <LuHeading6 />
        </EditorButton>

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

        {/*<EditorButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>*/}
        {/*  Horizontal rule*/}
        {/*</EditorButton>*/}
        {/*<EditorButton onClick={() => editor.chain().focus().setHardBreak().run()}>Hard break</EditorButton>*/}

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
