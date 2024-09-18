// Importa la biblioteca y configura tu clave API
import { retornaPromptRelaciones } from "@/lib/chatGPTPrompt";
import { NextResponse } from "next/server";
import OpenAI from "openai";

function tieneMasDeUnaPalabra(texto) {
  // Divide el texto en palabras usando el espacio en blanco como separador
  const palabras = texto.split(' ');

  // Filtra las palabras vacías (debido a espacios en blanco adicionales)
  const palabrasNoVacias = palabras.filter(palabra => palabra.trim() !== '');

  // Si hay más de una palabra no vacía, el string tiene más de una palabra
  return palabrasNoVacias.length > 1;
}

export const POST = async (req, res) => {

    const { palabra }  = await req.json()

    const openaiClient = new OpenAI({
        apiKey: process.env.CHAT_GPT_API_KEY
    })

  if (req.method === 'POST') {
    const { prompt } = req.body;

    try {
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: "system",
                content: "retorna los datos de la manera mas concisa"
            },
            {
                role: "user",
                content : retornaPromptRelaciones(palabra)
              
            }
        ],
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        
      });

      return new Response(JSON.stringify(response), { status: 201 })

    } catch (error) {
      console.error(error);
      return new Response("Error de solicitud", { status: 500 })
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};
