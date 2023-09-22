import { Spinner } from '@/material-tailwind';

export function DefaultLoading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner className="w-16 h-16" color="blue" />
    </div>
  );
}
