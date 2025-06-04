import { createContext, useContext, useState, useEffect } from 'react';
import { globals } from '../configs/global.config';
import { fetchEndpoint } from '../utils/fetchEndpoint.util';
import { authenticateWithCasinoToken } from '../services/authService.js';
import { useRef } from 'react';

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
  const didRunRef = useRef(false);

  console.log('2222');
  const urlParams = new URLSearchParams(window.location.search);
  
  const promotionIdFromUrl = urlParams.get("promotionId") || 
                           urlParams.get("promotionid") || 
                           urlParams.get("promotion-id") ||
                           urlParams.get("promoId") ||
                           urlParams.get("promoid");

                           
  const tokenFromUrl = urlParams.get("token");

  const [globalConfig, setGlobalConfig] = useState({
    ...globals,
    promotionId: promotionIdFromUrl || globals.promotionId,
    token: tokenFromUrl || globals.token,
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
    const setupGlobalsAndFetchAuthToken = async () => {
      if (didRunRef.current) return; // TODO: Remove later
       didRunRef.current = true;  // TODO: Remove later
      const currentUrlParams = new URLSearchParams(window.location.search);
      
      let resolvedPromotionId = currentUrlParams.get("promotionId") || 
                               currentUrlParams.get("promotionid") || 
                               currentUrlParams.get("promotion-id") ||
                               currentUrlParams.get("promoId") ||
                               currentUrlParams.get("promoid") ||
                               globals.promotionId;
      if (!resolvedPromotionId) {
        resolvedPromotionId = prompt("Enter promotionId", globals.promotionId || "");
      }
  
      
      let finalTokenToSet = currentUrlParams.get("token") || globals.token;

      if(!finalTokenToSet){
      try {
        if (!globals.casinoToken) {
          console.warn('GlobalContext: CasinoToken is not defined in global.config.js. Using fallback token.');
        } else {
          console.log(`GlobalContext: Attempting Hub Authentication with casinoToken: ${globals.casinoToken}`);
          const fetchedHubAccessToken = await authenticateWithCasinoToken(globals.casinoToken);
          if (fetchedHubAccessToken) {
            finalTokenToSet = fetchedHubAccessToken;
            console.log('GlobalContext: Successfully fetched Hub accessToken. This will be used as the application token.');
          } else {
            console.warn('GlobalContext: Hub Authentication failed or did not return a token. Using static token from global.config.js or URL.');
          }
        }
      } catch (error) {
        console.error('GlobalContext: Error during Hub Authentication. Using static token from global.config.js or URL.', error);
      }
    }
  
      setGlobalConfig(prev => ({
        ...prev,
        promotionId: resolvedPromotionId,
        token: finalTokenToSet 
      }));
  
      const newHistoryUrlParams = new URLSearchParams();
      if (resolvedPromotionId) newHistoryUrlParams.set("promotionid", resolvedPromotionId);
      if (finalTokenToSet) newHistoryUrlParams.set("token", finalTokenToSet);

      
      const currentPath = window.location.pathname;
      const newSearchString = newHistoryUrlParams.toString();
      const oldSearchString = currentUrlParams.toString();

      if (newSearchString !== oldSearchString) {
        window.history.replaceState({}, '', `${currentPath}${newSearchString ? '?' + newSearchString : ''}`);
        console.log('GlobalContext: URL updated with fetched/fallback token and params.');
      }
    };
    setupGlobalsAndFetchAuthToken();
  }, []); 

  useEffect(() => {
    const handleUrlChange = () => {
      const currentUrlParams = new URLSearchParams(window.location.search);
      const promotionIdFromUrlOnChange = currentUrlParams.get("promotionId") || 
                                       currentUrlParams.get("promotionid") || 
                                       currentUrlParams.get("promotion-id") ||
                                       currentUrlParams.get("promoId") ||
                                       currentUrlParams.get("promoid");
      
      const tokenFromUrlOnChange = currentUrlParams.get("token");


      setGlobalConfig(prev => ({
        ...prev,
        promotionId: promotionIdFromUrlOnChange || globals.promotionId || prev.promotionId,
        token: tokenFromUrlOnChange !== null ? tokenFromUrlOnChange : prev.token 
      }));
      console.log('GlobalContext: popstate processed, config updated.');
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
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