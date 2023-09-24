'use client';

import { createUser } from '@/actions/users';
import BackButton from '@/components/BackButton';
import SelectWrapper from '@/components/SelectWrapper';
import { Card, Input, Button, Typography, Option } from '@/material-tailwind';

export default function UsersNew() {
  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h3" color="black">
          New User
        </Typography>
        <BackButton />
      </div>
      <Card className="h-full w-full overflow-scroll mt-4 p-4">
        <form className="w-full max-w-screen-2xl" action={createUser}>
          <div className="mb-4 flex flex-col gap-6">
            <Input
              size="lg"
              label="Email"
              name="email"
              type="email"
              crossOrigin="false"
              required
            />
            <Input
              size="lg"
              label="Password"
              name="password"
              type="password"
              crossOrigin="false"
              required
            />
            <SelectWrapper label="Role" name="role">
              <Option value="USER">User</Option>
              <Option value="ADMIN">Admin</Option>
            </SelectWrapper>
          </div>
          <Button className="mt-6" fullWidth type="submit" color="blue">
            Create
          </Button>
        </form>
      </Card>
    </div>
  );
}
