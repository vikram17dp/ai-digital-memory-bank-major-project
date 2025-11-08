
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  User,
  Search,
  Plus,
  List,
  TrendingUp,
  Sparkles,
  MessageCircle,
  Send,
  Mic,
  Paperclip,
  Heart,
  ThumbsUp,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';

interface Reaction {
  emoji: string;
  count: number;
}

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
  reactions: Reaction[];
  followUps?: string[];
}

interface ChatInterfaceProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string;
    imageUrl: string;
  };
  onSectionChange?: (section: string) => void; // Optional, in case you need it
}

import { useRouter } from 'next/navigation';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // lightweight context to pass to AI for better summaries
  const [conversationContext, setConversationContext] = useState<Array<{ role: 'user'|'bot'; content: string }>>([]);

  // Static welcome message - computed once based on user name
  const initialMessage = useMemo<Message>(() => ({
    id: 1,
    type: 'bot',
    content: `Hello ${user?.firstName || 'there'}! ✨ I'm Memo, your AI memory assistant. I can help you search through your memories, create new ones, analyze your mood patterns, or answer questions about your stored information. What would you like to do today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: [],
  }), [user?.firstName]);

  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    {
      label: 'Search my memories',
      icon: Search,
      action: 'search_memories',
      color: 'from-blue-500 to-cyan-500',
      description: 'Find specific memories instantly',
    },
    {
      label: 'Create a new memory',
      icon: Plus,
      action: 'create_memory',
      color: 'from-green-500 to-emerald-500',
      description: 'Add a new memory with AI help',
    },
    {
      label: 'Show recent memories',
      icon: List,
      action: 'show_recent_memories',
      color: 'from-purple-500 to-pink-500',
      description: 'View your latest memories',
    },
    {
      label: 'Analyze my mood patterns',
      icon: TrendingUp,
      action: 'analyze_mood',
      color: 'from-orange-500 to-red-500',
      description: 'Understand your emotional journey',
    },
  ];

  const showFullMessage = (text: string, messageId: number) => {
    // Show the complete message immediately after a brief delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, content: text } : msg))
      );
      setStreamingMessageId(null);
    }, 500); // Brief delay to simulate thinking, then show full response
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };

    setMessages((prev) => [...prev, userMessage]);
    setConversationContext((ctx) => [...ctx, { role: 'user', content: message }].slice(-8));
    const currentMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: [],
      };

      setMessages((prev) => [...prev, botMessage]);
      showFullMessage(data.message, botMessage.id);
      setConversationContext((ctx) => [...ctx, { role: 'bot', content: data.message }].slice(-8));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReaction = (messageId: number, emoji: string) => {
    console.log('handleReaction called:', { messageId, emoji });
    setMessages((prev) => {
      const updated = prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = [...(msg.reactions || [])];
          const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);
          console.log('Found message, existing reactions:', reactions);
          if (existingReactionIndex >= 0) {
            reactions[existingReactionIndex] = {
              ...reactions[existingReactionIndex],
              count: reactions[existingReactionIndex].count + 1,
            };
          } else {
            reactions.push({ emoji, count: 1 });
          }
          console.log('Updated reactions:', reactions);
          return { ...msg, reactions };
        }
        return msg;
      });
      return updated;
    });
    
    // Show feedback toast
    const reactionName = emoji === '👍' ? 'Helpful' : emoji === '❤️' ? 'Love it' : 'Reaction';
    toast({
      description: `Marked as ${reactionName}`,
      duration: 2000,
    });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        description: 'Message copied to clipboard',
        duration: 2000,
      });
    }).catch((err) => {
      console.error('Failed to copy:', err);
      toast({
        description: 'Failed to copy message',
        variant: 'destructive',
        duration: 2000,
      });
    });
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Implement voice recognition here (e.g., Web Speech API)
  };

  async function analyzeAndRespond(action: string, apiData: any) {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, apiData, userId: user.id, userName: user.firstName, context: conversationContext }),
    })
    if (!res.ok) throw new Error('AI analyze failed')
    return res.json()
  }

  async function handleQuickAction(action: 'search_memories'|'show_recent_memories'|'analyze_mood'|'create_memory') {
    setIsTyping(true)
    setStreamingMessageId(null) // Reset streaming state

    // Insert a temporary bot bubble with typing cursor
    const pendingId = Date.now() + Math.floor(Math.random()*1000)
    const pending: Message = { id: pendingId, type: 'bot', content: '', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), reactions: [] }
    setMessages((prev) => [...prev, pending])
    setStreamingMessageId(pendingId) // Set streaming state for typing indicator

    try {
      let apiResp: any = null
      if (action === 'search_memories') {
        const resp = await fetch('/api/memories/search', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': user.id } , body: JSON.stringify({ query: '' }) })
        apiResp = await resp.json()
      } else if (action === 'show_recent_memories') {
        const resp = await fetch(`/api/memories/list?limit=5`, { headers: { 'Content-Type': 'application/json', 'x-user-id': user.id } })
        apiResp = await resp.json()
      } else if (action === 'analyze_mood') {
        const resp = await fetch(`/api/memories/analyze?range=30d`, { headers: { 'x-user-id': user.id } })
        apiResp = await resp.json()
      } else if (action === 'create_memory') {
        // Friendly confirmation then redirect
        const ai = await analyzeAndRespond('create_memory', { ok: true })
        setMessages((prev) => prev.map((m) => m.id === pendingId ? { ...m, content: ai.message, followUps: ai.followUps } : m))
        setConversationContext((ctx) => [...ctx, { role: 'bot', content: ai.message }].slice(-8))
        setStreamingMessageId(null)
        setIsTyping(false)
        setTimeout(() => router.push('/memories/create'), 900)
        return
      }

      const ai = await analyzeAndRespond(action, apiResp)
      setMessages((prev) => prev.map((m) => m.id === pendingId ? { ...m, content: ai.message, followUps: ai.followUps } : m))
      setConversationContext((ctx) => [...ctx, { role: 'bot', content: ai.message }].slice(-8))
    } catch (e) {
      console.error('Quick action error:', e)
      setMessages((prev) => prev.map((m) => m.id === pendingId ? { ...m, content: 'Sorry, I hit a snag while processing that. Try again in a moment.' } : m))
    } finally {
      setStreamingMessageId(null)
      setIsTyping(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col p-4">
        <Card className="h-full bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col">
          <CardContent className="p-0 flex-1 min-h-0 flex flex-col">
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 space-y-4 bg-gradient-to-b from-gray-50/30 to-gray-100/30 dark:from-gray-800/20 dark:to-gray-900/20 relative overflow-y-auto chat-messages-area">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>

                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`group relative ${msg.type === 'user' ? 'flex justify-end' : 'flex justify-start'} animate-fadeIn`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`flex items-start gap-4 max-w-4xl ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`relative flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                            msg.type === 'bot'
                              ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500'
                              : 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500'
                          } ring-2 ring-white/50 dark:ring-gray-800/50`}
                        >
                          {msg.type === 'bot' ? (
                            <Bot className="h-5 w-5 text-white" />
                          ) : (
                            <User className="h-5 w-5 text-white" />
                          )}
                        </div>
                        {msg.type === 'bot' && streamingMessageId === msg.id && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-50 animate-pulse"></div>
                        )}
                      </div>

                      <div className={`flex-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
                        <div
                          className={`relative inline-block max-w-lg group-hover:shadow-xl transition-all duration-300 ${
                            msg.type === 'bot'
                              ? 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 rounded-3xl rounded-tl-lg shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50'
                              : 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white rounded-3xl rounded-tr-lg shadow-lg'
                          } p-4 relative`}
                        >
                          {msg.type === 'bot' && (
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10"></div>
                            </div>
                          )}
                          <div className="relative z-10">
                            {streamingMessageId === msg.id && !msg.content ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">AI is thinking</span>
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.content}
                              </p>
                            )}
                          </div>

                          {msg.type === 'bot' && msg.content && (
                            <div
                              className={`relative z-20 flex items-center gap-2 mt-3 pt-2 border-t border-gray-200/50 dark:border-gray-600/50 opacity-100 transition-opacity duration-200 flex-wrap`}
                            >
                              {msg.followUps && msg.followUps.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap mr-auto">
                                  {msg.followUps.map((f, i) => (
                                    <Button key={i} variant="secondary" size="sm" className="h-6 px-2 text-xs relative z-20"
                                      onClick={() => {
                                        if (f.toLowerCase().includes('trend')) handleQuickAction('analyze_mood')
                                        else if (f.toLowerCase().includes('detail') || f.toLowerCase().includes('open')) handleQuickAction('show_recent_memories')
                                        else if (f.toLowerCase().includes('refine') || f.toLowerCase().includes('filter')) handleQuickAction('search_memories')
                                        else if (f.toLowerCase().includes('template') || f.toLowerCase().includes('editor')) handleQuickAction('create_memory')
                                      }}
                                    >{f}</Button>
                                  ))}
                                </div>
                              )}
                              <button
                                type="button"
                                title="Helpful"
                                className="relative z-20 h-6 px-2 text-xs rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 active:scale-95 transition-transform inline-flex items-center justify-center cursor-pointer pointer-events-auto"
                                onClick={() => {
                                  console.log('Thumbs up clicked!');
                                  handleReaction(msg.id, '👍');
                                }}
                              >
                                <ThumbsUp className="h-3 w-3 pointer-events-none" />
                              </button>
                              <button
                                type="button"
                                title="Love it"
                                className="relative z-20 h-6 px-2 text-xs rounded hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-transform inline-flex items-center justify-center cursor-pointer pointer-events-auto"
                                onClick={() => {
                                  console.log('Heart clicked!');
                                  handleReaction(msg.id, '❤️');
                                }}
                              >
                                <Heart className="h-3 w-3 pointer-events-none" />
                              </button>
                              <button
                                type="button"
                                title="Copy message"
                                className="relative z-20 h-6 px-2 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-transform inline-flex items-center justify-center cursor-pointer pointer-events-auto"
                                onClick={() => {
                                  console.log('Copy clicked!');
                                  handleCopy(msg.content);
                                }}
                              >
                                <Copy className="h-3 w-3 pointer-events-none" />
                              </button>
                            </div>
                          )}
                        </div>

                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {msg.reactions.map((reaction, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs px-2 py-1 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                              >
                                {reaction.emoji} {reaction.count}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div
                          className={`flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400 ${
                            msg.type === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {msg.type === 'user' && <span className="text-blue-500">✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              <div className="px-6 py-4 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      Quick Actions
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-1 bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    >
                      Smart Suggestions
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <Tooltip key={action.action}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => handleQuickAction(action.action as any)}
                            className="group h-auto p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:shadow-lg border border-gray-200/60 dark:border-gray-700/60 rounded-2xl transition-all duration-300 hover:scale-[1.02] text-left justify-start relative overflow-hidden backdrop-blur-sm"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-5`}></div>
                            </div>
                            <div className="relative flex items-center gap-3 w-full">
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                              >
                                <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-200 transition-all duration-300">
                                  {action.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 hidden sm:block">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">{action.description}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 p-2 bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-lg backdrop-blur-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/60 transition-all duration-300">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                          onClick={() => {}}
                        >
                          <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Attach file</TooltipContent>
                    </Tooltip>
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Ask me anything about your memories..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-9 w-9 p-0 rounded-xl transition-all duration-300 ${
                            isListening
                              ? 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                          onClick={handleVoiceInput}
                        >
                          <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isListening ? 'Stop listening' : 'Voice input'}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleSend}
                          disabled={!message.trim() || isTyping}
                          size="sm"
                          className="h-9 w-9 p-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                          <Send className="h-4 w-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send message</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center justify-between mt-2 px-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {isListening && (
                        <div className="flex items-center gap-1 text-red-500">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>Listening...</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {message.length > 0 && (
                        <span className={message.length > 500 ? 'text-orange-500' : ''}>
                          {message.length}/500
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </TooltipProvider>
  );
};

export default ChatInterface;







