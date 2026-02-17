'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, MessageCircle, Search, Bell, X, Menu, Maximize2, Mic, Send } from 'lucide-react';
import { Icon } from '@iconify/react';
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
        <div className={`transition-all duration-300 border-b border-[#EAECF0] last:border-0 ${isOpen ? 'bg-[#F9FAFB]' : 'hover:bg-[#F9FAFB]'}`}>
            <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center px-8 py-6 text-left group"
                aria-expanded={isOpen}
            >
                <div>
                    {value.category && (
                        <span className="text-[12px] font-bold text-[#685BC7] uppercase tracking-wider mb-2 block">{value.category}</span>
                    )}
                    <span className="text-[17px] font-semibold text-[#101828] font-inter group-hover:text-[#685BC7] transition-colors">{value.title}</span>
                </div>
                <div className={`ml-4 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#685BC7] rotate-180' : 'bg-white border border-[#EAECF0]'}`}>
                    {isOpen ? (
                        <Minus className="h-5 w-5 text-white" />
                    ) : (
                        <Plus className="h-5 w-5 text-[#667085]" />
                    )}
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-8 pt-2">
                    <p className="text-[#475467] text-[16px] leading-[1.6] font-inter">{value.description}</p>
                </div>
            </div>
        </div>
    )
}

const Support: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'faq' | 'bot'>('faq')
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
        <div className="max-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-[#EAECF0] sticky top-0 z-[10]">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-5">
                    <div className="flex justify-between items-center h-20">
                        <h1 className="text-2xl font-bold text-[#101828] font-inter">Support</h1>
                        <div className="flex items-center gap-2">
                            <button className="p-3 hover:bg-[#F9FAFB] rounded-xl transition-all border border-transparent hover:border-[#EAECF0]">
                                <Search className="h-5 w-5 text-[#667085]" />
                            </button>
                            <button className="p-3 hover:bg-[#F9FAFB] rounded-xl transition-all border border-transparent hover:border-[#EAECF0]">
                                <Bell className="h-5 w-5 text-[#667085]" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-h-screen mx-auto px-6 py-5">
                {/* Hero Section */}
                <div className="mb-12">
                    <h1 className="text-[10px] lg:text-[16px] font-bold text-[#101828] font-inter leading-[1.1] mb-6 tracking-tight">
                        The assistance you need
                    </h1>
                    <p className="text-[10px] lg:text-[16px] text-[#475467] leading-[1.5] max-w-[700px]">
                        Explore essential details about CROOSE, managed billing, and how to scale your business with automation.
                    </p>
                </div>

                {/* Modern Tab Switcher */}
                <div className="flex p-1.5 bg-[#F2F4F7] rounded-2xl w-fit mb-12 border border-[#EAECF0]">
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'faq'
                            ? 'bg-white text-[#101828] shadow-sm'
                            : 'text-[#667085] hover:text-[#101828]'
                            }`}
                    >
                        <Icon icon="lucide:help-circle" width="18" height="18" />
                        FAQ
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('bot');
                            setCrooseOpen(true);
                        }}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'bot'
                            ? 'bg-white text-[#101828] shadow-sm'
                            : 'text-[#667085] hover:text-[#101828]'
                            }`}
                    >
                        <Icon icon="lucide:bot" width="18" height="18" />
                        Live Bot
                    </button>
                </div>

                {/* FAQ Section */}
                <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center justify-between pb-6 border-b border-[#EAECF0]">
                        <h3 className="text-[28px] font-bold text-[#101828] font-inter">
                            Frequently Asked Questions
                        </h3>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#EAECF0] shadow-sm overflow-hidden">
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
                </div>

                {/* Help Footer */}
                {/* <div className="mt-20 p-10 lg:p-14 bg-[#101828] rounded-[2.5rem] relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col items-center text-center max-w-[600px] mx-auto">
                        <div className="w-16 h-16 bg-[#685BC7]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#685BC7]/20">
                            <Icon icon="lucide:message-circle" className="text-[#685BC7] w-8 h-8" />
                        </div>
                        <h3 className="text-[32px] font-bold text-white mb-4 tracking-tight">
                            Still need help?
                        </h3>
                        <p className="text-[#98A2B3] text-[18px] mb-10 leading-relaxed">
                            If you couldn't find the answer you were looking for, our human support team is just a click away.
                        </p>
                        <button
                            onClick={() => setCrooseOpen(true)}
                            className="bg-[#685BC7] text-white px-10 py-4 rounded-xl text-md font-bold hover:bg-[#584db1] transition-all flex items-center gap-3 shadow-lg shadow-[#685BC7]/20"
                        >
                            <Icon icon="lucide:user" width="20" height="20" />
                            Connect with Support
                        </button>
                    </div>
                   
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#685BC7] blur-[120px] opacity-10 rounded-full" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#685BC7] blur-[120px] opacity-10 rounded-full" />
                </div> */}
            </main>

            {/* Live Bot Popup */}
            {crooseOpen && (
                <div className="fixed inset-0 z-[200] flex justify-end items-end p-6 pointer-events-none">
                    <div className="pointer-events-auto w-[480px] h-[650px] max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-[#EAECF0] animate-slide-up">
                        {/* Header */}
                        <div className="px-8 py-6 bg-white border-b border-[#EAECF0] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#F9F5FF] flex items-center justify-center border border-[#685BC7]/10">
                                    <Icon icon="lucide:bot" className="text-[#685BC7] w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[18px] text-[#101828]">Croose Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
                                        <span className="text-[12px] font-medium text-[#475467]">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 hover:bg-[#F9FAFB] rounded-xl transition-all">
                                    <Icon icon="lucide:maximize-2" className="text-[#667085] w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        setCrooseOpen(false);
                                        setActiveTab('faq');
                                    }}
                                    className="p-2.5 hover:bg-[#F4EBFF] rounded-xl transition-all group"
                                >
                                    <Icon icon="lucide:x" className="text-[#667085] group-hover:text-[#685BC7] w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 bg-[#F9FAFB]/50 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-5 py-4 rounded-2xl shadow-sm text-[15px] leading-[1.5] ${msg.sender === 'user'
                                        ? 'bg-[#685BC7] text-white rounded-tr-none'
                                        : 'bg-white text-[#1d2939] border border-[#EAECF0] rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-[#EAECF0] px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-[#685BC7] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-1.5 h-1.5 bg-[#685BC7] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-1.5 h-1.5 bg-[#685BC7] rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-8 bg-white border-t border-[#EAECF0]">
                            <div className="relative group">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Ask anything..."
                                    className="w-full bg-[#F9FAFB] border border-[#D0D5DD] rounded-[1.25rem] px-5 py-4 pr-16 text-[15px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#F4EBFF] focus:border-[#685BC7] transition-all resize-none min-h-[60px] max-h-[120px]"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !input.trim()}
                                    className={`absolute right-3 bottom-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isLoading || !input.trim()
                                        ? 'bg-[#F2F4F7] text-[#D0D5DD]'
                                        : 'bg-[#685BC7] text-white shadow-md hover:bg-[#584db1]'
                                        }`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="mt-4 text-[12px] text-center text-[#667085] font-medium font-inter">
                                Usually responds within a few seconds
                            </p>
                        </div>
                    </div>
                    {/* Background Overlay */}
                    <div
                        className="fixed inset-0 bg-[#101828]/10 backdrop-blur-[2px] z-[-1] pointer-events-auto"
                        onClick={() => setCrooseOpen(false)}
                    />
                </div>
            )}
        </div>
    )
}

export default Support
