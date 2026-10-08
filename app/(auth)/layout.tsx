import { SiteHeader } from "@/components/layout/site-header";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-6 sm:px-8 lg:px-12 lg:pt-8">
        <SiteHeader />
      </div>
      {children}
    </>
  );
}
