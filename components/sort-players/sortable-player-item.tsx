"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface SortablePlayerItemProps {
  id: string;
  children: React.ReactNode;
  isDisabled?: boolean;
}

export const SortablePlayerItem: React.FC<SortablePlayerItemProps> = ({
  id,
  children,
  isDisabled,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, disabled: isDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      {children}
    </div>
  );
};
