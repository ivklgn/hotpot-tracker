import { Avatar, AvatarGroupProps } from '@chakra-ui/react';
import { AvatarGroup } from './ui/avatar';

interface UserAvatarProps {
  user: { userId: string; userEmail: string };
  size?: AvatarGroupProps['size'];
}

export function UserAvatar({ user, size }: UserAvatarProps) {
  return (
    <Avatar.Root
      key={user.userId}
      style={{
        backgroundColor: getColorByStr(user.userEmail),
      }}
      size={size}
    >
      <Avatar.Fallback name={user.userEmail} />
    </Avatar.Root>
  );
}
interface UserAvatarsProps {
  users: { userId: string; userEmail: string }[];
  size?: AvatarGroupProps['size'];
}

export function UserAvatars({ users, size }: UserAvatarsProps) {
  return (
    <AvatarGroup size={size} stacking="last-on-top">
      {users.map((user) => (
        <UserAvatar key={user.userId} user={user} />
      ))}
      {/* <Avatar.Root>
        <Avatar.Fallback>+3</Avatar.Fallback>
      </Avatar.Root> */}
    </AvatarGroup>
  );
}

function getColorByStr(str: string) {
  if (!str) {
    return '#fff';
  }
  let hash = 0;
  str.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, '0');
  }
  return colour;
}
