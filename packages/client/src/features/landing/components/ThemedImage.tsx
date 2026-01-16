import { Image, type ImageProps } from '@chakra-ui/react';
import { useColorMode } from '@/hooks/useColorMode';

interface ThemedImageProps extends Omit<ImageProps, 'src'> {
  readonly lightSrc: string;
  readonly darkSrc: string;
}

export function ThemedImage({ lightSrc, darkSrc, ...props }: ThemedImageProps) {
  const { colorMode } = useColorMode();

  return <Image src={colorMode === 'light' ? lightSrc : darkSrc} {...props} />;
}
