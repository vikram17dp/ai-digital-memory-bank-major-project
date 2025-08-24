"use client"

import { useState } from "react"
import { Send, Bot, Search, Plus, List, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AIAssistantProps {
  className?: string
}

export function AIAssistant({ className }: AIAssistantProps) {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickActions = [
    { label: "Search my memories", icon: Search, action: "search" },
    { label: "Create a new memory", icon: Plus, action: "create" },
    { label: "Show recent memories", icon: List, action: "recent" },
    { label: "Analyze my mood patterns", icon: TrendingUp, action: "analyze" },
  ]

  const handleSend = () => {
    if (!message.trim()) return
    setIsTyping(true)
    // Simulate AI response
    setTimeout(() => setIsTyping(false), 2000)
    setMessage("")
  }

  const handleQuickAction = (action: string) => {
    setMessage(`Try asking: "${quickActions.find(a => a.action === action)?.label}"`)
  }

  return (
    <Card className={`bg-gray-900/50 border-gray-800/50 backdrop-blur-sm shadow-2xl shadow-black/20 ${className}`}>
      <CardHeader className="pb-6 border-b border-gray-800/30">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Bot className="h-5 w-5 text-white" />
          </div>
          AI Memory Assistant
        </CardTitle>
        <p className="text-sm text-gray-400 mt-2">
          Ask me anything about your memories
        </p>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Chat Messages Area */}
        <div className="min-h-[280px] max-h-[350px] overflow-y-auto space-y-4 p-5 bg-gray-800/40 rounded-2xl border border-gray-700/40">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white leading-relaxed mb-3">
                Hello! I'm your AI memory assistant. I can help you search through your memories, create new ones, or answer questions about your stored information. What would you like to do today?
              </p>
              <span className="text-xs text-gray-500">07:56 PM</span>
            </div>
          </div>

          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 pt-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-300">Try asking:</p>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant="ghost"
                onClick={() => handleQuickAction(action.action)}
                className="justify-start gap-3 h-auto p-4 text-sm bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 hover:border-gray-600/60 text-gray-300 hover:text-white transition-all duration-300 rounded-xl"
              >
                <action.icon className="h-4 w-4" />
                <span className="font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-3 pt-2">
          <Input
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 rounded-xl"
          />
          <Button 
            onClick={handleSend} 
            disabled={!message.trim() || isTyping}
            className="h-12 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
