"use client"

import Link from "next/link";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@/material-tailwind";

import {
  PresentationChartBarIcon,
  UserCircleIcon,
  BookOpenIcon,
  BookmarkIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <PresentationChartBarIcon className="h-5 w-5" />,
    href: "/admin",
  },
  {
    label: "Users",
    icon: <UserCircleIcon className="h-5 w-5" />,
    href: "/admin/users",
  },
  {
    label: "Books",
    icon: <BookOpenIcon className="h-5 w-5" />,
    href: "/admin/books",
  },
  // {
  //   label: "Borrowing",
  //   icon: <BookmarkIcon className="h-5 w-5" />,
  //   href: "/admin/borrowing",
  // },
  {
    label: "Logout",
    icon: <PowerIcon className="h-5 w-5" />,
    href: "/admin/logout",
  }
];

export default function DefaultSidebar() {
  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Admin Panel
        </Typography>
      </div>
      <List>
        {
          sidebarItems.map((item) => (
            <Link href={item.href} key={item.label}>
              <ListItem>
                <ListItemPrefix>
                  {item.icon}
                </ListItemPrefix>
                {item.label}
              </ListItem>
            </Link>
          ))
        }
      </List>
    </Card>
  );
}
