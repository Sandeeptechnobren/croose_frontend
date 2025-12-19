'use client'
import React, { useState } from 'react'
import { Plus, Minus, MessageCircle, Search, Bell } from 'lucide-react'

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
        <div className="w-full rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-6 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-base text-gray-900 pr-4">
                    {value.title}
                </span>
                <div className="flex-shrink-0">
                    {isOpen ? (
                        <Minus className="w-5 h-5 text-purple-600" />
                    ) : (
                        <Plus className="w-5 h-5 text-gray-600" />
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="px-6 pb-6 animate-slideDown">
                    <p className="text-gray-600 leading-relaxed">
                        {value.description}
                    </p>
                </div>
            )}
        </div>
    )
}

const Support: React.FC = () => {
    const [crooseOpen, setCrooseOpen] = useState<boolean>(false)
    const [openIndex, setOpenIndex] = useState<number | null>(null)

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
        <div className='w-full min-h-screen bg-gray-50'>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Support</h1>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Search className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-8 py-8'>
                {/* Section Header */}
                <div className='mb-8'>
                    <h2 className='font-semibold text-xl text-gray-900 mb-2'>
                        How can we help you today?
                    </h2>
                    <p className='text-gray-600 text-sm'>
                        Find answers to common questions about CROOSE features, billing, and setup.
                    </p>
                </div>

                {/* Tab Buttons */}
                <div className='flex gap-3 mb-8'>
                    <button className='bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-colors'>
                        FAQ
                    </button>
                    <button
                        onClick={() => setCrooseOpen(true)}
                        className='flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors'
                    >
                        <MessageCircle className="w-4 h-4" />
                        Live Bot
                    </button>
                </div>

                {/* FAQ Title */}
                <h3 className='font-bold text-3xl text-gray-900 mb-6'>
                    Frequently Asked Questions
                </h3>

                {/* Accordion Section */}
                <div className="flex flex-col gap-4">
                    {faqData.map((value, index) => (
                        <Accordion
                            key={index}
                            value={value}
                            index={index}
                            openIndex={openIndex}
                            toggleAccordion={toggleAccordion}
                        />
                    ))}
                </div>

                {/* Help Footer */}
                <div className="mt-12 p-6 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">
                        Still need help?
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                        Can't find the answer you're looking for? Our support team is here to assist you.
                    </p>
                    <button
                        onClick={() => setCrooseOpen(true)}
                        className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                    >
                        Contact Support
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
            `}</style>
        </div>
    )
}

export default Support