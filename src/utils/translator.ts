import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function detectAndTranslate(text: string): Promise<{ 
  detectedLanguage: string;
  translation: string;
}> {
  const isSpanish = /[áéíóúñ¿¡]/i.test(text.toLowerCase()) || 
                    /\b(hola|gracias|por favor|si|no|que|como|estar|ser|hacer)\b/i.test(text.toLowerCase());
  const targetLanguage = isSpanish ? 'English' : 'Spanish';

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the following text to ${targetLanguage}. Provide ONLY the translation, no explanations or additional text.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3
    });

    const translation = response.choices[0].message.content?.trim();
    
    if (!translation) {
      throw new Error('Empty translation received');
    }

    return {
      detectedLanguage: isSpanish ? 'es' : 'en',
      translation
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      detectedLanguage: isSpanish ? 'es' : 'en',
      translation: '[Translation error: Please try again]'
    };
  }
}