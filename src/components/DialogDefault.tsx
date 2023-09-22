'use client';

import React from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@/material-tailwind';

export type DialogDefaultProps = {
  title: string;
  open: boolean;
  handleOpen: () => void;
  handleOk: () => void;
  children?: React.ReactNode;
};

export function DialogDefault({
  title,
  open,
  handleOpen,
  handleOk,
  children,
}: DialogDefaultProps) {
  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>{title}</DialogHeader>
      {children && <DialogBody divider>{children}</DialogBody>}
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleOk}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
