import {
  LuChevronDown,
  LuHeading,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuPilcrow,
} from 'react-icons/lu';
import { Flex, Kbd, MenuPositioner, Portal } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { getOperatingSystem } from '@/utils/os.ts';
import { useCurrentEditor } from '@tiptap/react';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu.tsx';
import { EditorButton } from '@/components/Editor/EditorButton.tsx';

const FontSizeOptionContent = ({ children }: PropsWithChildren) => (
  <Flex w="190px" gap="2" alignItems="center">
    {children}
  </Flex>
);

export const FontSizeSelector = () => {
  const { editor } = useCurrentEditor();

  const isMacOS = getOperatingSystem() === 'MacOS';

  const sizeList = [
    {
      title: 'Plain text',
      label: (
        <FontSizeOptionContent>
          <LuPilcrow /> Plain text&nbsp;
          <Kbd ml="auto" size="sm">
            {isMacOS ? 'Cmd' : 'Ctrl'} + Alt + 0
          </Kbd>
        </FontSizeOptionContent>
      ),
      onClick: () => editor?.chain().focus().setParagraph().run(),
      isActive: editor?.isActive('paragraph'),
    },
    {
      title: 'Heading 1',
      label: (
        <FontSizeOptionContent>
          <LuHeading1 /> Heading 1&nbsp;
          <Kbd ml="auto" size="sm">
            {isMacOS ? 'Cmd' : 'Ctrl'} + Alt + 1
          </Kbd>
        </FontSizeOptionContent>
      ),
      onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor?.isActive('heading', { level: 1 }),
    },
    {
      title: 'Heading 2',
      label: (
        <FontSizeOptionContent>
          <LuHeading2 /> Heading 2&nbsp;
          <Kbd ml="auto" size="sm">
            {isMacOS ? 'Cmd' : 'Ctrl'} + Alt + 2
          </Kbd>
        </FontSizeOptionContent>
      ),
      onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor?.isActive('heading', { level: 2 }),
    },
    {
      title: 'Heading 3',
      label: (
        <FontSizeOptionContent>
          <LuHeading3 /> Heading 3&nbsp;
          <Kbd ml="auto" size="sm">
            {isMacOS ? 'Cmd' : 'Ctrl'} + Alt + 3
          </Kbd>
        </FontSizeOptionContent>
      ),
      onClick: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor?.isActive('heading', { level: 3 }),
    },
    {
      title: 'Heading 4',
      label: (
        <FontSizeOptionContent>
          <LuHeading4 /> Heading 3&nbsp;
          <Kbd ml="auto" size="sm">
            {isMacOS ? 'Cmd' : 'Ctrl'} + Alt + 4
          </Kbd>
        </FontSizeOptionContent>
      ),
      onClick: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor?.isActive('heading', { level: 4 }),
    },
    {
      title: 'Heading 5',
      label: (
        <FontSizeOptionContent>
          <LuHeading5 /> Heading 5&nbsp;
          <Kbd ml="auto" size="sm">
            {isMacOS ? 'Cmd' : 'Ctrl'} + Alt + 5
          </Kbd>
        </FontSizeOptionContent>
      ),
      onClick: () => editor?.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: editor?.isActive('heading', { level: 5 }),
    },
    {
      title: 'Heading 6',
      label: (
        <FontSizeOptionContent>
          <LuHeading6 /> Heading 6&nbsp;
          <Kbd ml="auto" size="sm">
            {isMacOS ? 'Cmd' : 'Ctrl'} + Alt + 6
          </Kbd>
        </FontSizeOptionContent>
      ),
      onClick: () => editor?.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: editor?.isActive('heading', { level: 6 }),
    },
  ];

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <EditorButton title="Choose heading">
          <LuHeading />
          <LuChevronDown />
        </EditorButton>
      </MenuTrigger>

      <Portal>
        <MenuPositioner>
          <MenuContent>
            {sizeList.map((s) => (
              <MenuItem
                key={s.title}
                onClick={s.onClick}
                colorPalette={s.isActive ? 'teal' : 'gray'}
                bg={s.isActive ? { _light: 'teal.100', _dark: 'teal.500' } : 'transparent'}
                value={s.title}
              >
                {s.label}
              </MenuItem>
            ))}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};
