import { createContext, useState, useEffect, useRef, useCallback } from "react";
import run from "../config/gemini";

export const AppContext = createContext();

const AppProvider = ( {children} ) => {
  const getInitialTheme = useCallback(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === null ? false : JSON.parse(storedTheme);
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => getInitialTheme());
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const typingEffectTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDarkMode));
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const startTypingEffect = useCallback((text) => {
    // useCallback here
    let index = 0;
    const formattedText = formatText(text);
    clearInterval(typingEffectTimeoutRef.current); // Clear any existing interval
    typingEffectTimeoutRef.current = setInterval(() => {
      if (index < formattedText.length) {
        setDisplayedText(formattedText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingEffectTimeoutRef.current);
      }
    }, 5);
  }, []);

  useEffect(() => {
    clearTimeout(typingEffectTimeoutRef.current);

    if (resultData && showResult) {
      setDisplayedText("");
      startTypingEffect(resultData);
    }
  }, [resultData, showResult, startTypingEffect]);

  const formatText = (text) => {
    // Basic formatting: replace newlines with <br/> for display
    if (!text) return ""; // Handle null or undefined text

    return text.replace(/\n/g, "<br/>");
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setResultData("");
    setDisplayedText("New Chat, Ask Gemini...");
  };

  const onSent = useCallback(
    async (prompt) => {
      setRecentPrompt(prompt);
      setShowResult(true);
      setLoading(true);
      setInput("");
      setResultData("");
      setDisplayedText("");
      try {
        const response = await run(prompt);
        setResultData(response);
      } catch (error) {
        console.error("Error in onSent: ", error);
        setDisplayedText("Error occurred during generation.");
        setResultData("Error occurred during generation.");
      } finally {
        setLoading(false);
      }
    },
    [run, setLoading, setShowResult, setResultData]
  );

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

  const values = {
    input,
    isDarkMode,
    toggleDarkMode,
    setInput,
    recentPrompt,
    setRecentPrompt,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    displayedText,
    onSent,
    newChat,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppProvider;
