import { createContext, useContext, useState, useEffect } from 'react';
import { globals } from '../configs/global.config';
import { fetchEndpoint } from '../utils/fetchEndpoint.util';

export const GlobalContext = createContext();

const tryParseJson = (text) => {
  let processedText = text.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  processedText = processedText.replace(/'/g, '"');
  try {
    return { parsedObject: JSON.parse(processedText), parsedSuccessfully: true };
  } catch (e) {
    return { parsedObject: text, parsedSuccessfully: false };
  }
};

export const GlobalProvider = ({ children }) => {
  const [globalConfig, setGlobalConfig] = useState({
    ...globals,
    translate: (text, lang) => {
      const parsed = tryParseJson(text);
      if (parsed.parsedSuccessfully) {
        return (
          parsed.parsedObject[lang] ||
          parsed.parsedObject[globals.defaultLanguage] ||
          "<strong>content not found</strong>"
        );
      }
      return text;
    }
  });

  useEffect(() => {
    const setupGlobals = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const promotionIdFromUrl = urlParams.get("promotionId") || 
                               urlParams.get("promotionid") || 
                               urlParams.get("promotion-id") ||
                               urlParams.get("promoId") ||
                               urlParams.get("promoid");
      
      let promotionId = promotionIdFromUrl || "";
      
      if (!promotionId && globalConfig.promotionId) {
        promotionId = globalConfig.promotionId;
        urlParams.set("promotionId", promotionId);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
      }
      
      if (!promotionId) {
        const userInput = prompt("Enter promotionId", "");
        if (userInput) {
          promotionId = userInput;
          urlParams.set("promotionId", promotionId);
          window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
        } else {
          promotionId = "default-promotion";
        }
      }

      const token = urlParams.get("token") ||
        "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJQbGF5ZXJJZCI6IjEiLCJVc2VyTmFtZSI6ImFjaGFuZ2VsaWEiLCJTZWdtZW50SWRzIjoiZGVmYXVsdCIsImV4cCI6MjM0MDY1Mjk0MywiaXNzIjoiSFVCIiwiYXVkIjoiSFVCLUFVRElFTkNFIn0.usZBHjkuF74VbvCBoiVza0yFll0uSntmvC8_UKNd2kE7Ez5MmZlJoJHsCkjdF2rHD0kh8F1iyiFIIjVi1zsx-Q";

      const externalId = urlParams.get("externalId") || 
                        urlParams.get("externalid") || 
                        urlParams.get("external-id") || 
                        urlParams.get("leaderboardId") || 
                        urlParams.get("leaderboardid");

      setGlobalConfig(prev => ({
        ...prev,
        promotionId,
        token,
        externalId
      }));
    };

    setupGlobals();
  }, []);

  return (
    <GlobalContext.Provider value={{ 
      globalConfig,
      setGlobalConfig,
      fetchEndpoint 
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}; 