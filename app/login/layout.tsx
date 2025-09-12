import { NavbarLogin } from "@/components/layout/navbar/navbar_login";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <NavbarLogin />
      <main className="mx-auto inline-block max-w-lg text-center justify-center">
        {children}
      </main>
    </div>
  );
}
