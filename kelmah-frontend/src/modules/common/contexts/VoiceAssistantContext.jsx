import React, { createContext, useContext, useState } from 'react';

const VoiceAssistantContext = createContext(null);

export const VoiceAssistantProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false);

  const speak = (text) => {
    if (!enabled || !window.speechSynthesis) return;
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
  };

  const toggle = () => setEnabled(prev => !prev);

  return (
    <VoiceAssistantContext.Provider value={{ enabled, speak, toggle }}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error('useVoiceAssistant must be used within VoiceAssistantProvider');
  }
  return context;
};