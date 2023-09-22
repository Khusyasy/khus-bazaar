import { Typography } from '@/material-tailwind';

export type UserDetailParams = {
  id: string;
};

export default function UserDetail({ params }: { params: UserDetailParams }) {
  return (
    <Typography variant="h3" color="blue-gray">
      Books {JSON.stringify(params)}
    </Typography>
  );
}
