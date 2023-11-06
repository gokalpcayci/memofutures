import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default function EditorLayout({ children }: Props) {
  return (
    <div className="min-h-screen mx-auto container items-start gap-10 py-8">
      {children}
    </div>
  );
}
