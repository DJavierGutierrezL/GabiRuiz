import React, { useState, useRef, useEffect } from 'react';
import { DiamondIcon } from './icons/DiamondIcon';
import { SendIcon } from './icons/SendIcon';
import { XIcon } from './icons/XIcon';
import { Appointment, Client, Product, Prices, KandyAIMessage } from '../types';
import { getKandyAIResponse } from '../services/kandyAIService';

interface KandyAIProps {
    appointments: Appointment[];
    clients: Client[];
    products: Product[];
    prices: Prices;
}

const KandyAI: React.FC<KandyAIProps> = ({ appointments, clients, products, prices }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<KandyAIMessage[]>([
        { sender: 'kandy', text: '¡Hola! Soy Kandy, tu asistente. ¿En qué te puedo ayudar hoy?' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleToggleChat = () => {
        setIsOpen(prev => !prev);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: KandyAIMessage = { sender: 'user', text: userInput };
        const updatedMessages = [...messages, newUserMessage];
        
        setMessages(updatedMessages);
        setUserInput('');
        setIsLoading(true);
        
        try {
            const responseText = await getKandyAIResponse(updatedMessages, { appointments, clients, products, prices });
            const newKandyMessage: KandyAIMessage = { sender: 'kandy', text: responseText };
            setMessages(prev => [...prev, newKandyMessage]);
        } catch (error) {
            const errorMessage: KandyAIMessage = { sender: 'kandy', text: "Lo siento, ocurrió un error. Por favor intenta de nuevo." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-4 sm:right-6 md:right-8 w-[calc(100%-2rem)] max-w-sm h-3/5 max-h-[500px] bg-white dark:bg-gray-800 shadow-2xl rounded-2xl flex flex-col transition-all duration-300 ease-in-out z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full">
                            <DiamondIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="ml-3 text-lg font-bold text-gray-800 dark:text-gray-100">Kandy AI</h3>
                    </div>
                    <button onClick={handleToggleChat} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-pink-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'}`}>
                                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none">
                                    <div className="flex items-center space-x-2">
                                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>
                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Pregúntale a Kandy..."
                            className="w-full pl-4 pr-12 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={isLoading}
                        />
                        <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 disabled:bg-gray-400 transition-colors" disabled={isLoading || !userInput.trim()}>
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
            {/* Floating Action Button */}
            <button
                onClick={handleToggleChat}
                className="fixed bottom-4 right-4 sm:right-6 md:right-8 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white transform transition-transform hover:scale-110 z-50"
                aria-label="Abrir asistente Kandy AI"
            >
                <DiamondIcon className="w-8 h-8" />
            </button>
        </>
    );
};

export default KandyAI;