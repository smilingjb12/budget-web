import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  email: string | null | undefined;
  imageUrl: string | undefined;
}

export const AvatarDropdown = ({ email, imageUrl }: Props) => {
  const router = useRouter();
  const nameAcronym =
    email
      ?.split("@")
      .map((n) => n[0])
      .join("") ?? "";

  const ProfileImage = () => {
    return (
      <Avatar className="size-9 cursor-pointer">
        <AvatarImage src={imageUrl} alt={email ?? nameAcronym} />
        <AvatarFallback className="bg-primary text-background uppercase">
          {nameAcronym}
        </AvatarFallback>
      </Avatar>
    );
  };

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");

    // Redirect to sign-in page
    router.push("/sign-in");
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{ProfileImage()}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[340px] pb-4">
          <div className="flex flex-row px-5 py-5 gap-x-3">
            <div>{ProfileImage()}</div>
            <div className="text-sm flex items-center">{email}</div>
          </div>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="px-8 py-3 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="ml-5">Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
