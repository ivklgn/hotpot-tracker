import { useEffect } from 'react';

const DEFAULT_TITLE = 'Hotpot Tracker';

interface HelmProps {
  title: string;
}

export default function Helm({ title }: HelmProps) {
  useEffect(() => {
    document.title = title + ' | ' + DEFAULT_TITLE;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);

  return null;
}
