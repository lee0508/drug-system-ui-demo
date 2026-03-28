import "./globals.css";
import AppProvider from "@/components/AppProvider";

export const metadata = {
  title: "마약류중독자관리시스템 UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
