import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";

export default function LoginPage() {
  return (
    <div className="flex flex-1 justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/Deep South Fireworks Logo.png"
              alt="Deep South Fireworks Logo"
              width={200}
              height={100}
              priority
              className="mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Inventory Management System
            </h1>
          </div>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SignIn />
            </TabsContent>

            <TabsContent value="signup">
              <SignUp />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
