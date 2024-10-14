import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import Header from "./Header";
import Navbar, { NavbarProps } from "./NavBar";

export default function PageScaffold({
  route,
  children,
}: {
  route: "/home" | "/newsfeed" | "/messages";
  children: ReactNode;
}) {
  return (
    <div className="h-dvh bg-background-color max-h-dvh flex flex-col">
      {/* header */}
      <Header />
      <Navbar route={route} />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
