import type { Metadata } from "next";
import "./globals.css";
import Button from './components/Button';
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dnd Todo",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
          <header className="bg-yellow-300">
            <div className="max-w-screen-lg my-0 mx-auto py-2.5">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">
                  <Link href="/">trip todo</Link>
                </h1>
                <Button link='/plan/new' text='新規プラン作成' />
              </div>
            </div>
          </header>
          {children}
      </body>
    </html>
  );
}
