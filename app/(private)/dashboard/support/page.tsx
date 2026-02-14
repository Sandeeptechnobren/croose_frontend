'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, MessageCircle, Search, Bell, X, Menu, Maximize2, Mic, Send } from 'lucide-react';
import { liveBotChat } from '@/app/Apis/publicapi';

interface FAQItem {
    title: string
    description: string
    category?: string
}

interface AccordionProps {
    index: number
    value: FAQItem
    toggleAccordion: (index: number) => void
    openIndex: number | null
}

const Accordion: React.FC<AccordionProps> = ({ index, value, toggleAccordion, openIndex }) => {
    const isOpen = openIndex === index

    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-6 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-medium text-gray-900">{value.title}</span>
                <div className="ml-4 flex-shrink-0">
                    {isOpen ? (
                        <Minus className="h-5 w-5 text-purple-600" />
                    ) : (
                        <Plus className="h-5 w-5 text-gray-400" />
                    )}
                </div>
            </button>
            {isOpen && (
                <div className="px-6 pb-6">
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
            )}
        </div>
    )
}

const Support: React.FC = () => {
    const [crooseOpen, setCrooseOpen] = useState(false)
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
        { text: 'Hello! I am your Croose assistant. How can I help you today?', sender: 'bot' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }])
        setInput('')
        setIsLoading(true)

        try {
            const response = await liveBotChat(userMessage)
            setMessages(prev => [...prev, { text: response.reply, sender: 'bot' }])
        } catch (error) {
            setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }])
        } finally {
            setIsLoading(false)
        }
    }

    const toggleAccordion = (index: number): void => {
        setOpenIndex(prev => (prev === index ? null : index))
    }

    const faqData: FAQItem[] = [
        {
            title: "What is CROOSE?",
            description: "CROOSE is an intelligent WhatsApp business automation platform designed for small businesses. It combines booking management, payment processing, customer communication, and inventory tracking into a single, unified system. Think of it as your AI-powered business assistant that operates 24/7 on WhatsApp, delivering a seamless and professional experience to your customers while you focus on growing your business.",
            category: "Getting Started"
        },
        {
            title: "How do I set up automated responses?",
            description: "Setting up automated responses is straightforward. After completing your onboarding, your WhatsApp assistant is immediately active. To customize responses, navigate to your 'Space IQ' dashboard where you can add business-specific information, upload documents, FAQs, and product catalogs. The system uses this information to generate contextual, intelligent responses to customer inquiries. You can update this information anytime to keep your assistant current.",
            category: "Setup"
        },
        {
            title: "How does the booking system work?",
            description: "CROOSE's booking system integrates directly with WhatsApp conversations. Customers can check availability, book appointments, and receive confirmations all within the chat. You can set your available time slots, buffer times between appointments, and business hours. The system automatically prevents double bookings and sends reminder notifications to both you and your customers. You'll receive real-time updates on your dashboard for all bookings.",
            category: "Features"
        },
        {
            title: "What payment methods do you accept?",
            description: "We support multiple payment options to serve our global customer base. International customers can pay via Stripe, which accepts all major credit and debit cards. For customers in Ghana, we offer mobile money payment options for convenient local transactions. Mobile money subscribers receive a subscription dashboard showing remaining days and automatic reminders 5 days before renewal, ensuring uninterrupted service.",
            category: "Billing"
        },
        {
            title: "Can I integrate CROOSE with my existing tools?",
            description: "Yes! CROOSE is built with integration in mind. You can connect your existing calendar systems, payment gateways, and CRM tools through our integration dashboard. We support popular platforms and also provide API access for custom integrations. Our support team can assist you with setting up integrations specific to your business needs.",
            category: "Features"
        },
        {
            title: "How do I manage my inventory through CROOSE?",
            description: "CROOSE provides a comprehensive inventory management system accessible through your dashboard. You can add products, track stock levels, set low-stock alerts, and update pricing in real-time. When customers inquire about products through WhatsApp, the assistant automatically provides current availability and pricing information. The system also generates inventory reports to help you make informed stocking decisions.",
            category: "Features"
        },
        {
            title: "What happens if I cancel my subscription?",
            description: "You can cancel your subscription at any time without penalties. Simply contact our support team through the CROOSE support bot or reach us directly via WhatsApp. We'll process your cancellation request promptly, and your service will remain active until the end of your current billing cycle. Please note that after cancellation, your WhatsApp assistant will stop operating once the paid period expires. You can reactivate your subscription anytime.",
            category: "Billing"
        },
        {
            title: "Is my customer data secure?",
            description: "Absolutely. We take data security seriously and implement industry-standard encryption protocols for all data transmission and storage. Your customer information is stored securely and is never shared with third parties without your explicit consent. We comply with international data protection regulations and conduct regular security audits. You maintain full ownership of your data and can export it at any time.",
            category: "Security"
        },
        {
            title: "How does the AI assistant handle customer inquiries?",
            description: "Our AI assistant is trained to understand natural language and context. It references your Space IQ knowledge base to provide accurate, personalized responses aligned with your business. For complex queries it can't handle, the system intelligently escalates to you with full conversation context. You can also train the assistant by adding common questions and preferred responses to your knowledge base, making it smarter over time.",
            category: "Features"
        },
        {
            title: "What kind of support do you offer?",
            description: "We provide comprehensive support through multiple channels. Access instant help via our AI support bot, submit tickets through your dashboard, or contact us directly on WhatsApp for urgent issues. Our support team is available during business hours, and we typically respond within 2-4 hours. Premium plan subscribers receive priority support with faster response times. We also offer onboarding assistance and training resources.",
            category: "Support"
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-purple-600">Support</h1>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Search className="h-5 w-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Bell className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        How can we help you today?
                    </h2>
                    <p className="text-lg text-gray-600">
                        Find answers to common questions about CROOSE features, billing, and setup.
                    </p>
                </div>

                {/* Tab Buttons */}
                <div className="flex gap-3 mb-8">
                    <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
                        <MessageCircle className="h-4 w-4" />
                        FAQ
                    </button>
                    <button
                        onClick={() => setCrooseOpen(true)}
                        className='flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors'
                    >
                        <MessageCircle className="h-4 w-4" />
                        Live Bot
                    </button>
                </div>

                {/* FAQ Title */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </h3>
                </div>

                {/* Accordion Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {faqData.map((value, index) => (
                        <Accordion
                            key={index}
                            index={index}
                            value={value}
                            toggleAccordion={toggleAccordion}
                            openIndex={openIndex}
                        />
                    ))}
                </div>

                {/* Help Footer */}
                <div className="mt-12 text-center bg-purple-50 rounded-lg p-8 border border-purple-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Still need help?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Can't find the answer you're looking for? Our support team is here to assist you.
                    </p>
                    <button
                        onClick={() => setCrooseOpen(true)}
                        className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                    >
                        Contact Support
                    </button>
                </div>
            </main>

            {/* Live Bot Popup */}
            {crooseOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0"
                        onClick={() => setCrooseOpen(false)}
                    />

                    {/* Popup */}
                    <div className="fixed bottom-6 right-6 w-[450px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100 font-sans">
                        {/* Popup Header */}
                        <div className="flex items-center justify-between px-6 py-5 bg-white">
                            <div className="flex items-center gap-4">
                                <button className="p-1 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Menu className="h-5 w-5 text-gray-700" />
                                </button>
                                <h3 className="font-semibold text-lg text-gray-900">Live Bot</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-1 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Maximize2 className="h-5 w-5 text-gray-400 rotate-90" />
                                </button>
                                <button
                                    onClick={() => setCrooseOpen(false)}
                                    className="p-1 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <X className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Popup Content - Chat Area */}
                        <div className="flex-1 overflow-auto bg-white px-6 py-4 flex flex-col gap-6">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                                    <div className={`${msg.sender === 'user' ? 'bg-[#F2F4F7] text-gray-800' : 'bg-purple-600 text-white'} px-5 py-3 rounded-2xl ${msg.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} max-w-[85%] text-[0.95rem] leading-snug`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1">
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-gray-500 text-sm">Bot is thinking...</div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Popup Footer - Input Area */}
                        <div className="p-6 bg-white">
                            <div className="relative flex items-center bg-white border border-gray-200 rounded-[1.5rem] px-4 py-3 shadow-sm">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask a question, perform an action, or give instructions..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-[0.95rem] text-gray-600 placeholder:text-gray-400"
                                />
                                <div className="flex items-center gap-2 ml-2">
                                    <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                                        <Plus className="h-5 w-5" />
                                    </button>
                                    <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                                        <Mic className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={isLoading}
                                        className={`h-8 w-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Support