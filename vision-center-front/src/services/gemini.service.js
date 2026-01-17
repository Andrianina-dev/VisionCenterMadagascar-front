class GeminiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  }

  async sendMessage(message, conversationHistory = []) {
    try {
      const response = await fetch(`${this.baseURL}/gemini/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_history: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      return {
        success: false,
        error: 'Impossible de contacter le service IA. Veuillez réessayer plus tard.'
      };
    }
  }

  async generateContent(message, context = []) {
    try {
      const response = await fetch(`${this.baseURL}/gemini/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      return {
        success: false,
        error: 'Impossible de générer le contenu. Veuillez réessayer plus tard.'
      };
    }
  }

  async streamContent(message, context = [], onChunk) {
    try {
      const response = await fetch(`${this.baseURL}/gemini/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          message: message,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (onChunk) {
                onChunk(parsed);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming content from Gemini:', error);
      if (onChunk) {
        onChunk({
          error: 'Impossible de contacter le service IA. Veuillez réessayer plus tard.',
          done: true
        });
      }
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/gemini/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking Gemini health:', error);
      return {
        status: 'unhealthy',
        error: 'Service indisponible'
      };
    }
  }
}

export default new GeminiService();
