import { createContext, ReactNode, useContext, useState } from "react";

const MyContext = createContext<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);
export const useAppContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useAppContext must be used within a MyProvider");
  }
  return context;
};
export const MyProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <MyContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </MyContext.Provider>
  );
};
