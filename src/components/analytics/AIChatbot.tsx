"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Bot, User, TrendingUp, BarChart3, PieChart, Users, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'insight' | 'chart';
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  analyticsData: {
    funnelData: Array<{ name: string; value: number }>;
    monthlyLeadData: Array<{ name: string; leads: number }>;
    leadSourceData: Array<{ name: string; value: number }>;
    propertyPerformanceData: Array<{ name: string; leads: number; siteVisits: number; tokens: number }>;
  };
}

export function AIChatbot({ isOpen, onClose, analyticsData }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI analytics assistant. I can help you understand your data better. Ask me questions like:\n\n• "What\'s our conversion rate?"\n• "Which property is performing best?"\n• "Show me lead source insights"\n• "What\'s the trend in monthly leads?"\n\n💡 **New:** You can now use voice input by clicking the microphone button!',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateInsights = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    // Conversion rate analysis
    if (lowerQuestion.includes('conversion') || lowerQuestion.includes('rate')) {
      const totalLeads = analyticsData.funnelData[0]?.value || 0;
      const registered = analyticsData.funnelData[analyticsData.funnelData.length - 1]?.value || 0;
      const conversionRate = totalLeads > 0 ? ((registered / totalLeads) * 100).toFixed(1) : '0';
      
      return {
        type: 'insight' as const,
        content: `📊 **Conversion Rate Analysis**

Your overall conversion rate is **${conversionRate}%** (${registered} registrations out of ${totalLeads} leads).

**Funnel Breakdown:**
${analyticsData.funnelData.map((item, index) => {
  const prevValue = index > 0 ? analyticsData.funnelData[index - 1].value : item.value;
  const conversion = index > 0 ? ((item.value / prevValue) * 100).toFixed(1) : '100';
  return `• ${item.name}: ${item.value} (${conversion}% conversion from previous step)`;
}).join('\n')}

**Recommendations:**
- Focus on improving the "Contacted" stage for better lead nurturing
- Consider A/B testing your demo booking process
- Analyze drop-off points to optimize conversion`
      };
    }

    // Property performance analysis
    if (lowerQuestion.includes('property') || lowerQuestion.includes('best performing')) {
      const bestProperty = analyticsData.propertyPerformanceData.reduce((best, current) => 
        current.leads > best.leads ? current : best
      );
      
      // Create a copy of the array before sorting to avoid read-only error
      const sortedProperties = [...analyticsData.propertyPerformanceData].sort((a, b) => b.leads - a.leads);
      
      return {
        type: 'insight' as const,
        content: `🏢 **Property Performance Analysis**

**Best Performing Property:** ${bestProperty.name}
- Leads: ${bestProperty.leads}
- Site Visits: ${bestProperty.siteVisits}
- Tokens: ${bestProperty.tokens}

**All Properties Ranked by Leads:**
${sortedProperties
  .map((prop, index) => `${index + 1}. ${prop.name}: ${prop.leads} leads`)
  .join('\n')}

**Key Insights:**
- Average leads per property: ${Math.round(analyticsData.propertyPerformanceData.reduce((sum, p) => sum + p.leads, 0) / analyticsData.propertyPerformanceData.length)}
- Best conversion rate: ${bestProperty.name} (${((bestProperty.tokens / bestProperty.leads) * 100).toFixed(1)}%)`
      };
    }

    // Lead source analysis
    if (lowerQuestion.includes('lead source') || lowerQuestion.includes('source')) {
      const totalLeads = analyticsData.leadSourceData.reduce((sum, source) => sum + source.value, 0);
      
      // Create a copy of the array before sorting to avoid read-only error
      const sortedLeadSources = [...analyticsData.leadSourceData].sort((a, b) => b.value - a.value);
      
      return {
        type: 'insight' as const,
        content: `🎯 **Lead Source Analysis**

**Top Performing Sources:**
${sortedLeadSources
  .map((source, index) => `${index + 1}. ${source.name}: ${source.value}% (${Math.round((source.value / 100) * totalLeads)} leads)`)
  .join('\n')}

**Distribution Insights:**
- Most effective: ${analyticsData.leadSourceData[0]?.name} (${analyticsData.leadSourceData[0]?.value}%)
- Diversification score: ${analyticsData.leadSourceData.length} different sources

**Recommendations:**
- Invest more in ${analyticsData.leadSourceData[0]?.name} marketing
- Explore underperforming sources for optimization
- Consider A/B testing different source strategies`
      };
    }

    // Monthly trend analysis
    if (lowerQuestion.includes('monthly') || lowerQuestion.includes('trend')) {
      const totalLeads = analyticsData.monthlyLeadData.reduce((sum, month) => sum + month.leads, 0);
      const avgMonthly = Math.round(totalLeads / analyticsData.monthlyLeadData.length);
      const lastMonth = analyticsData.monthlyLeadData[analyticsData.monthlyLeadData.length - 1]?.leads || 0;
      const firstMonth = analyticsData.monthlyLeadData[0]?.leads || 0;
      const growth = firstMonth > 0 ? (((lastMonth - firstMonth) / firstMonth) * 100).toFixed(1) : '0';
      
      return {
        type: 'insight' as const,
        content: `📈 **Monthly Lead Trend Analysis**

**Overall Performance:**
- Total leads: ${totalLeads}
- Average monthly leads: ${avgMonthly}
- Growth rate: ${growth}% (${growth.startsWith('-') ? 'decrease' : 'increase'})

**Monthly Breakdown:**
${analyticsData.monthlyLeadData.map(month => `• ${month.name}: ${month.leads} leads`).join('\n')}

**Trend Insights:**
${lastMonth > avgMonthly ? '📈 Above average performance' : '📉 Below average performance'} in recent month
${growth.startsWith('-') ? '⚠️ Declining trend detected' : '🚀 Positive growth trajectory'}

**Recommendations:**
${lastMonth < avgMonthly ? '• Focus on lead generation strategies\\n• Analyze seasonal factors' : '• Maintain current momentum\\n• Scale successful campaigns'}`
      };
    }

    // Default response for unrecognized queries
    return {
      type: 'text' as const,
      content: `I can help you analyze your analytics data! Here are some questions you can ask:\n
🎯 **Conversion Analysis:**
- "What's our conversion rate?"
- "Show me funnel performance"

🏢 **Property Insights:**
- "Which property is performing best?"
- "Show me property performance"

🎯 **Lead Sources:**
- "What are our top lead sources?"
- "Show me lead source distribution"

📈 **Trends:**
- "What's the monthly lead trend?"
- "Show me growth patterns"

Feel free to ask any of these questions or request specific insights!`
    };
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      // Fallback: add a message about microphone access
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I\'m sorry, I couldn\'t access your microphone. Please ensure you\'ve granted microphone permissions and try again. You can still type your questions!',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Simulate transcription with a delay
      // In a real app, you would send this to a speech-to-text API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate some common analytics questions
      const simulatedTranscriptions = [
        "What's our conversion rate?",
        "Which property is performing best?",
        "Show me lead source insights",
        "What's the trend in monthly leads?",
        "How are we doing with property performance?",
        "Tell me about our lead sources",
        "Show me conversion analytics"
      ];
      
      const randomTranscription = simulatedTranscriptions[Math.floor(Math.random() * simulatedTranscriptions.length)];
      setInput(randomTranscription);
      
      // Add a message indicating transcription was successful
      const transcriptionMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🎤 **Audio transcribed:** "${randomTranscription}"\n\nPress Enter or click Send to ask this question!`,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, transcriptionMessage]);
      
    } catch (error) {
      console.error('Error transcribing audio:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I\'m sorry, I had trouble transcribing your audio. Please try again or type your question.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateInsights(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        type: response.type
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Disable background scrolling when chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Enhanced backdrop with stronger blur effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-lg pointer-events-auto"></div>
      
      {/* Enhanced floating glass panel with improved glass morphism */}
      <Card className="relative w-full max-w-4xl h-[calc(100vh-2rem)] md:h-[80vh] flex flex-col bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto transform transition-all duration-300 ease-out mx-2 my-4 md:mx-4">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/30 bg-white/80 backdrop-blur-lg p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Bot className="h-5 w-5 md:h-6 md:w-6 text-blue-600 drop-shadow-sm" />
            <CardTitle className="text-base md:text-lg font-semibold text-gray-800 drop-shadow-sm">AI Analytics Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-white/70 backdrop-blur-lg border border-white/50 rounded-full transition-all duration-200"
          >
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[calc(80vh-240px)] min-h-[200px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" ref={scrollAreaRef}>
            <div className="space-y-4 md:space-y-6 flex flex-col items-center">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 md:gap-4 w-full max-w-4xl ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/70 backdrop-blur-lg border border-white/50 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Bot className="h-4 w-4 md:h-5 md:w-5 text-blue-600 drop-shadow-sm" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-xl p-3 md:p-4 shadow-lg backdrop-blur-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white shadow-blue-200/50 border border-blue-400/30'
                        : message.type === 'insight'
                        ? 'bg-white/80 backdrop-blur-lg border border-blue-200/40 shadow-blue-100/40'
                        : 'bg-white/80 backdrop-blur-lg border border-white/50 shadow-gray-100/40'
                    }`}
                  >
                    <div className="text-sm md:text-base leading-relaxed whitespace-pre-line">{message.content}</div>
                    <div className={`text-xs mt-1 md:mt-2 font-medium ${
                      message.role === 'user' ? 'text-blue-100/80' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/70 backdrop-blur-lg border border-white/50 flex items-center justify-center shadow-lg flex-shrink-0">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-gray-600 drop-shadow-sm" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 md:gap-4 w-full max-w-4xl justify-start">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/70 backdrop-blur-lg border border-white/50 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Bot className="h-4 w-4 md:h-5 md:w-5 text-blue-600 drop-shadow-sm" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-lg border border-white/50 rounded-xl p-3 md:p-4 shadow-lg">
                    <div className="flex space-x-1 md:space-x-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="border-t border-white/40 p-4 md:p-6 bg-white/40 backdrop-blur-md">
            <div className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isRecording ? "🎤 Recording... Click mic to stop" : isTranscribing ? "📝 Transcribing audio..." : "Ask me about your analytics data..."}
                className="flex-1 bg-white/70 backdrop-blur-lg border-white/50 focus:border-blue-400 focus:ring-blue-400 shadow-md"
                disabled={isTyping || isRecording || isTranscribing}
              />
              <Button 
                onClick={toggleRecording} 
                disabled={isTyping || isTranscribing}
                variant={isRecording ? "destructive" : "outline"}
                title={isRecording ? "Stop recording" : "Start voice input"}
                className="border-white/50 hover:bg-white/80 backdrop-blur-lg shadow-md px-2 md:px-3"
              >
                {isRecording ? <MicOff className="h-3 w-3 md:h-4 md:w-4" /> : <Mic className="h-3 w-3 md:h-4 md:w-4" />}
              </Button>
              <Button onClick={handleSend} disabled={isTyping || !input.trim() || isRecording || isTranscribing} className="bg-blue-600 hover:bg-blue-700 shadow-md px-2 md:px-4">
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
            
            {isRecording && (
              <div className="flex items-center gap-2 mt-2 md:mt-3 text-xs md:text-sm text-red-600 font-medium">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse"></div>
                Recording... Click the microphone again to stop
              </div>
            )}
            
            {isTranscribing && (
              <div className="flex items-center gap-2 mt-2 md:mt-3 text-xs md:text-sm text-blue-600 font-medium">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce"></div>
                Transcribing your audio...
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 md:gap-2 mt-3 md:mt-4 max-w-4xl mx-auto justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("What's our conversion rate?")}
                disabled={isTyping}
                className="bg-white/60 backdrop-blur-lg border-white/50 hover:bg-white/80 text-gray-700 text-xs md:text-sm py-1 md:py-2"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Conversion Rate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("Which property is performing best?")}
                disabled={isTyping}
                className="bg-white/70 backdrop-blur-sm border-white/60 hover:bg-white/90 text-gray-700 text-xs md:text-sm py-1 md:py-2"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Best Property
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("What are our top lead sources?")}
                disabled={isTyping}
                className="bg-white/70 backdrop-blur-sm border-white/60 hover:bg-white/90 text-gray-700 text-xs md:text-sm py-1 md:py-2"
              >
                <PieChart className="h-3 w-3 mr-1" />
                Lead Sources
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("Show me monthly trends")}
                disabled={isTyping}
                className="bg-white/70 backdrop-blur-sm border-white/60 hover:bg-white/90 text-gray-700 text-xs md:text-sm py-1 md:py-2"
              >
                <Users className="h-3 w-3 mr-1" />
                Monthly Trends
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}