'use client';

import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

type DynamicIconProps = {
  name: keyof typeof Icons;
  props?: LucideProps;
};

export default function DynamicIcon({ name, props }: DynamicIconProps) {
  const IconComponent = Icons[name] as React.ComponentType<LucideProps>;

  if (!IconComponent) {
    return <span>Icon "{name}" not found.</span>;
  }

  return <IconComponent {...props} />;
}
