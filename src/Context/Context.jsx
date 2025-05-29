import { createContext, useState, useEffect, useRef, useCallback } from "react";
import run from "../config/gemini";

export const AppContext = createContext();

const AppProvider = ({ children }) => {

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const typingEffectTimeoutRef = useRef(null);

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

  // Redirect to home page on new chat
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setResultData("");
    setDisplayedText("New Chat, Ask Gemini...");
    window.location.pathname = "/";
  };

  // Send prompt on Enter key
  const onKeyUp = (e) => {
    if (e.key === "Enter" && input.trim()) {
      onSent(input.trim());
      setRecentPrompt((prev) => [input.trim(), ...prev]);
    }
  };

  // Update recentPrompts when prompt is sent via other means
  const onSent = useCallback(
    async (prompt) => {
      setRecentPrompt(prompt);
      setRecentPrompt((prev) => [prompt, ...prev]);
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

  const values = {
    input,
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
    onKeyUp,
  };


  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppProvider;
