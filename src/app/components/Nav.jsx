import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const Nav = () => {
  return (
    <div className="shadow-sm flex items-center px-24 py-8 justify-between">
      <Link href={"/"}>
        <h1 className="font-bold text-3xl">Health Chatbot</h1>
      </Link>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>
          <h2 className="font-bold text-xl">GD</h2>
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Nav;
