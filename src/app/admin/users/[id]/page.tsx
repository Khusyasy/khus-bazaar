import { editUser } from '@/actions/users';
import BackButton from '@/components/BackButton';
import SelectWrapper from '@/components/SelectWrapper';
import prisma from '@/db';
import { Card, Input, Button, Typography, Option } from '@/material-tailwind';

export type UserDetailParams = {
  id: string;
};

export default async function UserDetail({
  params,
}: {
  params: UserDetailParams;
}) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h3" color="black">
          {user ? `Editing user ${user.email}` : 'User Not Found'}
        </Typography>
        <BackButton />
      </div>
      {user && (
        <Card className="h-full w-full overflow-scroll mt-4 p-4">
          <form className="w-full max-w-screen-2xl" action={editUser}>
            <input type="hidden" name="id" value={user.id} />
            <div className="mb-4 flex flex-col gap-6">
              <Input
                size="lg"
                label="Email"
                name="email"
                type="email"
                crossOrigin="false"
                required
                defaultValue={user.email}
              />
              <Input
                size="lg"
                label="Password"
                name="password"
                type="password"
                crossOrigin="false"
              />
              <SelectWrapper
                label="Role"
                name="role"
                required
                defaultValue={user.role}
              >
                <Option value="USER">User</Option>
                <Option value="ADMIN">Admin</Option>
              </SelectWrapper>
            </div>
            <Button className="mt-6" fullWidth type="submit" color="blue">
              Update
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
