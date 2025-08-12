import React, { useState, useEffect } from 'react';
import { generateMarketingMessage } from '../services/geminiService';
import { Client, Appointment } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { SendIcon } from './icons/SendIcon';

interface MarketingProps {
  clients: Client[];
  appointments: Appointment[];
}

const Marketing: React.FC<MarketingProps> = ({ clients, appointments }) => {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(clients.length > 0 ? clients[0].id : null);
  const [messageType, setMessageType] = useState<'reminder' | 'promotion' | 'birthday'>('reminder');
  const [promotionText, setPromotionText] = useState('20% de descuento en tu próxima pedicura spa!');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Update selected client if the client list changes
  useEffect(() => {
    if (clients.length > 0 && !clients.find(c => c.id === selectedClientId)) {
      setSelectedClientId(clients[0].id);
    } else if (clients.length === 0) {
      setSelectedClientId(null);
    }
  }, [clients, selectedClientId]);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const handleGenerateMessage = async () => {
    if (!selectedClient) {
      alert('Por favor, selecciona un cliente.');
      return;
    }
    if (messageType === 'promotion' && !promotionText) {
      alert('Por favor, introduce el texto de la promoción.');
      return;
    }

    setIsLoading(true);
    setGeneratedMessage('');
    
    // Find the next appointment for the selected client to send a reminder
    const appointmentForClient = appointments
        .filter(a => a.clientName === selectedClient.name && new Date(a.date) >= new Date())
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    if (messageType === 'reminder' && !appointmentForClient) {
        alert('Este cliente no tiene citas próximas para enviarle un recordatorio.');
        setIsLoading(false);
        return;
    }

    try {
      const message = await generateMarketingMessage(messageType, selectedClient, {
        appointment: appointmentForClient,
        promotion: messageType === 'promotion' ? promotionText : undefined,
      });
      setGeneratedMessage(message);
    } catch (error) {
      setGeneratedMessage('Hubo un error al generar el mensaje.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
        <SparklesIcon className="w-7 h-7 mr-3 text-yellow-500" />
        Marketing y Fidelización con IA
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Seleccionar Cliente
            </label>
            <select
              id="client-select"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => setSelectedClientId(parseInt(e.target.value))}
              value={selectedClientId || ''}
              disabled={clients.length === 0}
            >
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            {clients.length === 0 && <p className="text-xs text-red-500 mt-1">No hay clientes para seleccionar.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Mensaje</label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => setMessageType('reminder')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm ${messageType === 'reminder' ? 'bg-pink-500 text-white shadow' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'}`}
              >
                Recordatorio
              </button>
              <button
                onClick={() => setMessageType('promotion')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm ${messageType === 'promotion' ? 'bg-purple-500 text-white shadow' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'}`}
              >
                Promoción
              </button>
              <button
                onClick={() => setMessageType('birthday')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm ${messageType === 'birthday' ? 'bg-yellow-500 text-white shadow' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'}`}
              >
                Cumpleaños
              </button>
            </div>
          </div>
          
          {messageType === 'promotion' && (
            <div>
              <label htmlFor="promotion-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Texto de la Promoción
              </label>
              <textarea
                id="promotion-text"
                rows={3}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={promotionText}
                onChange={(e) => setPromotionText(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={handleGenerateMessage}
            disabled={isLoading || !selectedClient}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Generar Mensaje con IA
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="bg-pink-50 dark:bg-gray-700 p-6 rounded-lg flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Vista Previa del Mensaje de WhatsApp</h3>
          <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl shadow-inner p-4 space-y-2">
            {generatedMessage ? (
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{generatedMessage}</p>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-center my-auto">
                El mensaje generado por la IA aparecerá aquí...
              </p>
            )}
          </div>
          <button className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-600 transition-colors flex items-center justify-center disabled:bg-gray-400"
            disabled={!generatedMessage || isLoading}>
            <SendIcon className="w-5 h-5 mr-2" />
            Enviar a {selectedClient?.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketing;