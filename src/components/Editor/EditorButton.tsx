import { Button, ButtonProps } from '@/components/ui/button.tsx';

export interface IEditorButtonProps extends ButtonProps {
  isActive?: boolean;
}

export function EditorButton(props: IEditorButtonProps) {
  const { isActive, children, ...otherProps } = props;

  return (
    <Button size="xs" variant={isActive ? 'solid' : 'subtle'} {...otherProps}>
      {children}
    </Button>
  );
}
