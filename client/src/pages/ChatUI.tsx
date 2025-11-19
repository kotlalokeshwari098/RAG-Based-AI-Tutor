import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  image?: string 
}

const ChatUI = () => {
  const { id } = useParams<{ id: string }>()
  // console.log(id)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I've analyzed your PDF. Ask me anything about the document.",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        question: input,
        topicId: id
      })
      // console.log("API Response:", response.data

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.data.answer,
        image:`${response.data.data.image.url}`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-800">
          AI Document Assistant
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Ask questions based on your uploaded PDF
        </p>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 animate-fadeIn ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Bot Avatar */}
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center shrink-0 mb-1">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`
                  max-w-[70%] px-4 py-3 rounded-2xl shadow-md
                  ${
                    message.isUser
                      ? "bg-indigo-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                  }
                `}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>

                {/* Display Image if available */}
                {message.image && !message.isUser && (
                  <div className="mt-3">
                    <img
                      src={`${message.image}`}
                      alt="Related diagram"
                      className="rounded-lg max-w-full h-auto shadow-sm border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Related image from the document
                    </p>
                  </div>
                )}

                <span
                  className={`text-xs mt-1 block ${
                    message.isUser ? "text-indigo-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-end gap-2 animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center shrink-0 mb-1">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                </svg>
              </div>
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md border border-gray-200">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative ">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask something about your document..."
                rows={1}
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none resize-none text-gray-800 placeholder-gray-400 shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{ maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatUI