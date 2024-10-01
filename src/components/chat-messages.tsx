import { ChatSession, Message } from "@/app/api/chat-session/router";
import { ralewayFont } from "@/app/fonts";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";

type Props = {
  sessionMessage: ChatSession;
  setChatContainerRef: React.Dispatch<React.SetStateAction<boolean>>;
  isSetChatContainerRef: boolean;
};

export const ChatMessages = (props: Props) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [props.sessionMessage]);

  return (
    <div
      className={`${
        props.isSetChatContainerRef
          ? "w-full flex flex-col" // Show full width on mobile if true
          : "" 
      }w-3/5 md:w-8/12 flex flex-col h-full bg-[#F7F7FD]`}
    >
      {/* Static Banner */}
      <div className="w-full bg-gray-100 flex items-center justify-start gap-x-3 p-3 sm:p-4 z-10 shadow-md cursor-default">
        <div
          className="text-xl block sm:hidden"
          onClick={() => props.setChatContainerRef(false)}
        >
          <IoArrowBack />
        </div>

        <Image
          src="/profile.jpg"
          alt="Profile"
          width={1000}
          height={1000}
          className="rounded-full w-12 h-12 object-contain cursor-pointer"
        />
        <div>
          <h2 className="text-base font-medium text-[#000929] tracking-tight">
            {props.sessionMessage.name}
          </h2>
          <div className="text-sm font-medium text-green-500 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex flex-col space-y-4 p-4 pt-20 overflow-y-auto"
        ref={chatContainerRef}
      >
        {[...props.sessionMessage.messages]
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          .map((message: Message) => (
            <div
              key={message.id} // Add key for React
              className={`flex flex-col gap-y-1 ${
                message.action === "USER" ? "items-end" : ""
              }`}
            >
              <div
                className={`p-4 rounded-lg w-72 md:w-80 lg:w-96 shadow-lg shadow-gray-200 ${
                  message.action === "USER"
                    ? "bg-blue-500 text-white self-end"
                    : message.action === "AI"
                    ? "bg-[#000929] text-white self-start"
                    : ""
                }`}
                style={ralewayFont.style}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <span
                className={`text-xs ${
                  message.action === "USER" ? "text-gray-700" : "text-gray-500"
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};