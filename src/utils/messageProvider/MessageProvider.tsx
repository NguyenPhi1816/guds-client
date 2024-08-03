"use client";
import React, { createContext, ReactNode, useContext } from "react";
import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";

const MessageContext = createContext<MessageInstance | null>(null);

interface IMessageProvider {
  children: ReactNode;
}

const MessageProvider: React.FC<IMessageProvider> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

const useGlobalMessage = (): MessageInstance => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useGlobalMessage must be used within a MessageProvider");
  }
  return context;
};

export default MessageProvider;
export { useGlobalMessage };
