
import { GoogleGenAI } from "@google/genai";
import { Client, Appointment } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we'll proceed, but API calls will fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generateReminderPrompt = (client: Client, appointment: Appointment): string => {
  return `Actúa como un asistente amigable de un salón de manicura llamado "Manicurista Pro".
  Escribe un recordatorio de cita corto y alegre para WhatsApp.
  
  Detalles del cliente:
  - Nombre: ${client.name}
  
  Detalles de la cita:
  - Fecha: ${appointment.date}
  - Hora: ${appointment.time}
  - Servicio: ${appointment.service}
  
  Instrucciones:
  - Saluda al cliente por su nombre.
  - Recuérdale su cita para mañana.
  - Menciona la fecha y la hora.
  - Termina con un tono amigable, como "¡Estamos emocionados de verte!".
  - Mantén el mensaje por debajo de 50 palabras.`;
};

const generatePromotionPrompt = (client: Client, promotion: string): string => {
  return `Actúa como un asistente de marketing entusiasta de un salón de manicura llamado "Manicurista Pro".
  Escribe un mensaje promocional corto y atractivo para WhatsApp.
  
  Detalles del cliente:
  - Nombre: ${client.name}
  
  Detalles de la promoción:
  - Oferta: "${promotion}"
  
  Instrucciones:
  - Saluda al cliente por su nombre.
  - Preséntale la promoción especial de una manera emocionante.
  - Crea un sentido de urgencia o exclusividad (ej. "oferta por tiempo limitado", "solo para nuestros clientes valiosos").
  - Anímale a reservar una cita para aprovechar la oferta.
  - Mantén el mensaje por debajo de 60 palabras.`;
};

const generateBirthdayPrompt = (client: Client): string => {
  return `Actúa como un asistente amigable y entusiasta de un salón de manicura llamado "Manicurista Pro".
  Escribe un mensaje de cumpleaños muy alegre y festivo para WhatsApp.
  
  Detalles del cliente:
  - Nombre: ${client.name}
  
  Instrucciones:
  - Saluda al cliente por su nombre y deséale un muy feliz cumpleaños.
  - Como regalo especial por su día, ofrécele un 20% de descuento en su próximo servicio.
  - Anímale a reservar una cita para celebrar y usar su descuento.
  - Usa un tono muy festivo y personal.
  - Mantén el mensaje por debajo de 60 palabras.`;
};


export const generateMarketingMessage = async (
    type: 'reminder' | 'promotion' | 'birthday',
    client: Client,
    details: { appointment?: Appointment; promotion?: string }
  ): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("Error: La clave API de Gemini no está configurada. Por favor, configura la variable de entorno API_KEY.");
    }

    let prompt = '';
    if (type === 'reminder' && details.appointment) {
        prompt = generateReminderPrompt(client, details.appointment);
    } else if (type === 'promotion' && details.promotion) {
        prompt = generatePromotionPrompt(client, details.promotion);
    } else if (type === 'birthday') {
        prompt = generateBirthdayPrompt(client);
    }
    else {
        return Promise.reject('Invalid message type or missing details.');
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Hubo un error al generar el mensaje. Por favor, inténtalo de nuevo.";
    }
};