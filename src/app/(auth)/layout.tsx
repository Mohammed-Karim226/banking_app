import InitialAnimation from "@/src/components/InitialAnimation/InitialAnimation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <InitialAnimation />
      {children}
    </main>
  );
}
