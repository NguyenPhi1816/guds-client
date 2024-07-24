import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";

interface INextAuthProvider {
  children: ReactNode;
}

const NextAuthProvider: FC<INextAuthProvider> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
