import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { generateChatReply, SUGGESTED_PROMPTS, type ChatMessage } from "@/lib/sample-chat";
import assistantMark from "@/assets/assistant-mark.png";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat | Workplace AI" },
      {
        name: "description",
        content:
          "Ask anything about work: draft emails, summarise meeting notes, build agendas or improve your writing in a modern chat interface.",
      },
      { property: "og:title", content: "AI Workplace Chat | Workplace AI" },
      {
        property: "og:description",
        content:
          "Ask anything about work: draft emails, summarise meeting notes, build agendas or improve your writing in a modern chat interface.",
      },
    ],
  }),
  component: WorkplaceChat,
});

function WorkplaceChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setThinking(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: generateChatReply(trimmed) },
      ]);
      setThinking(false);
    }, 900);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-4xl flex-col px-4 py-6 sm:px-6">
      <header className="flex items-center gap-3">
        <img
          src={assistantMark}
          alt="Workplace AI assistant"
          width={512}
          height={512}
          loading="lazy"
          className="size-10 rounded-xl bg-primary-soft object-contain p-1.5"
        />
        <div>
          <h1 className="font-display text-lg font-semibold text-foreground">AI Workplace Chat</h1>
          <p className="text-xs text-muted-foreground">
            Drafting, summarising and planning support for everyday office work
          </p>
        </div>
      </header>

      <div className="card-soft mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="gap-6">
            {messages.length === 0 && !thinking ? (
              <ConversationEmptyState
                icon={
                  <img
                    src={assistantMark}
                    alt=""
                    width={512}
                    height={512}
                    loading="lazy"
                    className="size-14 object-contain"
                  />
                }
                title="Ask me anything about work"
                description="Try one of the suggestions below, or type your own question to get started."
              />
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent
                    className={
                      message.role === "user"
                        ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                        : ""
                    }
                  >
                    {message.role === "assistant" ? (
                      <MessageResponse>{message.content}</MessageResponse>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </MessageContent>
                </Message>
              ))
            )}

            {thinking && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Thinking...</Shimmer>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border bg-surface p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => send(prompt)}
                disabled={thinking}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary-soft hover:text-primary-soft-foreground disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          <PromptInput
            onSubmit={(_message, event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about work..."
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit
                status={thinking ? "submitted" : "ready"}
                disabled={!input.trim() || thinking}
              />
            </PromptInputFooter>
          </PromptInput>

          <AiDisclaimer variant="compact" className="mt-3" />
        </div>
      </div>
    </div>
  );
}
