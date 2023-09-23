import { Card, CardBody, CardHeader, Typography } from '@/material-tailwind';

export default function InfoCard({
  icon,
  title,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
}) {
  return (
    <Card className="h-max w-max overflow-scroll">
      <CardBody>
        {icon}
        <Typography variant="h5" color="gray">
          {title}
        </Typography>
        <Typography variant="small" color="blue-gray">
          {count}
        </Typography>
      </CardBody>
    </Card>
  );
}
