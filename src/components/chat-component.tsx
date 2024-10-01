"use client";
import { ChatSession, fetchChatSessions } from "@/app/api/chat-session/router";
import { interFont } from "@/app/fonts";
import { removePrefix } from "@/utils/remove-prefix";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {ChatMessages} from "./chat-messages";

export const ChatComponent: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionMessage, setSessionMessage] = useState<ChatSession | null>(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [ischatContainerRef, setChatContainerRef] = useState<boolean>(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Updated loadChatSessions function
  const loadChatSessions = async (page: number) => {
    setLoadingMore(true);
    try {
      const data = await fetchChatSessions(page, 20);
      setTimeout(() => {
        setChatSessions((prevSessions) => [
          ...prevSessions,
          ...data.chat_sessions,
        ]);
        setLoadingMore(false);
      }, 700);
    } catch (error: any) {
      setError(error.message);
      setLoadingMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatSessions(page);
  }, [page]);

  const handleScroll = () => {
    if (
      listContainerRef.current &&
      listContainerRef.current.scrollTop +
        listContainerRef.current.clientHeight >=
        listContainerRef.current.scrollHeight - 50
    ) {
      if (!loadingMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };
  if (loading && page === 1) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className={`w-full sm:w-[1280px] h-full sm:h-[890px] sm:flex items-center justify-center border-2 border-red-500  `}>
      {/* Chat sessions list */}
      <div
        className={`${
          ischatContainerRef === true ? "hidden:block" : ""
        } w-[100%] sm:w-2/5 md:w-5/12 lg:w-4/12 h-full flex flex-col`}
      >
        <div
          className=" tracking-tight p-4 bg-[#F7F7FD] text-2xl font-semibold shadow-lg shadow-gray-700/20 z-10"
          style={interFont.style}
        >
          Chat Sessions Dashboard
        </div>
        <div
          className="w-full h-full  overflow-y-scroll bg-white"
          onScroll={handleScroll}
          ref={listContainerRef}
        >
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className="w-full flex items-start"
              style={interFont.style}
            >
              <div className="w-full cursor-pointer">
                <div
                  className={`w-full rounded-lg flex flex-col items-start justify-start p-4  duration-150 ease-in transition-all 
                        ${
                          session.id === sessionMessage?.id
                            ? "bg-[#C8C8FF]"
                            : "hover:bg-[#C8C8FF]/50"
                        }
                    `}
                  onClick={() => {
                    setSessionMessage(session);
                    setChatContainerRef(true);
                  }}
                >
                  <div className=" w-full gap-x-2 flex items-start justify-start">
                    <Image
                      src="/profile.jpg"
                      alt="Profile"
                      width={1000}
                      height={1000}
                      className="rounded-full w-12 sm:w-10 lg:w-12 h-12 sm:h-10 lg:h-12 object-contain "
                    />
                    <div className=" w-full h-full flex flex-col items-start justify-start gap-1">
                      <div className=" w-full flex items-center justify-between pr-1">
                        <h2 className="text-base font-semibold text-[#000929] tracking-tight line-clamp-1">
                          {removePrefix(session.name)}
                        </h2>
                        <span className="text-xs">
                          {session.messages
                            .slice()
                            .sort(
                              (a, b) =>
                                new Date(a.timestamp).getTime() -
                                new Date(b.timestamp).getTime()
                            )
                            [session.messages.length - 1].timestamp.slice(
                              11,
                              16
                            )}
                        </span>
                      </div>
                      <span className=" text-sm sm:text-xs md:text-sm line-clamp-1 text-black/80">
                        {
                          session.messages
                            .slice()
                            .sort(
                              (a, b) =>
                                new Date(a.timestamp).getTime() -
                                new Date(b.timestamp).getTime()
                            )[session.messages.length - 1].content
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-11/12 mx-auto h-[1px] px-2 bg-[#76767C]/80"></div>
              </div>
            </div>
          ))}

          {loadingMore && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
      {/* Chat messages */}
      {sessionMessage ? (
        <ChatMessages
          sessionMessage={sessionMessage}
          setChatContainerRef={setChatContainerRef}
          isSetChatContainerRef={ischatContainerRef}
        />
      ) : (
        <div className="w-8/12 h-full flex flex-col bg-[#F7F7FD]"></div>
      )}
    </div>
  );
};
