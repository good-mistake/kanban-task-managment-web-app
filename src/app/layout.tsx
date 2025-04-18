"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Providers } from "./providers";
import "../style/styles.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppContent>{children}</AppContent>
        </Providers>{" "}
        <div id="modal-root" />
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const isModalOpen = activeModal !== null;
  type ModalType = "edit" | "delete" | "create" | null;
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <>
      <Header
        isSidebarOpen={isSidebarOpen}
        isModalOpen={isModalOpen}
        setActiveModal={setActiveModal}
        activeModal={activeModal}
      />
      <main
        className={`appLayout ${
          isSidebarOpen ? "sidebarOpen" : "sidebarClosed"
        }`}
      >
        <Sidebar
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          isModalOpen={isModalOpen}
        />
        <div className="content">{children}</div>
      </main>
    </>
  );
}
