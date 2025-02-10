import { useContext, useState, useEffect, useCallback } from "react";
import { assets } from "../../assets/assets";
import "../Main/Main.css";
import { AppContext } from "../../Context/Context";
import run from "../../config/gemini";
import { FaMoon } from "react-icons/fa";

const Main = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    displayedText,
    recentPrompt,
    setShowResult,
    setLoading,
    loading,
    setRecentPrompt,
    setResultData,
    setInput,
    input,
  } = useContext(AppContext);

  const [error, setError] = useState(null);

  const fetchResponse = useCallback(
    async (prompt) => {
      // useCallback here
      if (prompt.trim() === "") return;

      setLoading(true);
      setShowResult(true);
      setResultData("");
      setError(null); // Clear any previous errors

      try {
        const response = await run(prompt);
        setResultData(response);
      } catch (err) {
        console.error("Error fetching response:", err);
        setError("Error occurred during generation."); // Set the error message
        setResultData("Error occurred during generation.");
      } finally {
        setLoading(false);
      }
    },
    [run, setLoading, setShowResult, setResultData, setError]
  );

  useEffect(() => {
    if (recentPrompt) {
      fetchResponse(recentPrompt);
    }
  }, [recentPrompt, fetchResponse]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError(null); // Clear errors when the user types
  };

  const handleClick = () => {
    setRecentPrompt(input);
  };

  return (
    <div className={`main ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="navbar">
        <p>
          <img className="icon" src={assets.gemini_icon} alt="" />
          Gemini
        </p>
        <div className="toggle-container">
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider round"> </span> {/* The slider */}
          </label>
          <FaMoon
            className="toggle-icon"
            style={{ color: isDarkMode ? "skyblue" : "gold" }}
          />
        </div>
        <img src={assets.user_icon} alt="User Profile" />
      </div>

      <div className="main-container">
        {!recentPrompt ? ( // Check recentPrompt instead of showResult
          <>
            <div className="greet">
              <p>
                <span>Hello, Developer</span>
              </p>
              <p>How can I Assist you today?</p>
            </div>

            <div className="cards">
              {/* Example cards - you can map over an array of suggestions */}
              <div
                className="card"
                onClick={() => {
                  setInput(
                    "Suggest beautiful places to see on an upcoming road trip"
                  );
                  setRecentPrompt(
                    "Suggest beautiful places to see on an upcoming road trip"
                  );
                }}
              >
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() => {
                  setInput("Briefly summarize this concept: urban planning");
                  setRecentPrompt(
                    "Briefly summarize this concept: urban planning"
                  );
                }}
              >
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() => {
                  setInput(
                    "Brainstorm team-building activities for our work retreat"
                  );
                  setRecentPrompt(
                    "Brainstorm team-building activities for our work retreat"
                  );
                }}
              >
                <p>Brainstorm team-building activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() => {
                  setInput("Improve the readability of the following code");
                  setRecentPrompt(
                    "Improve the readability of the following code"
                  );
                }}
              >
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data gemini-response">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : error ? ( // Display error message if there is one
                <p style={{ color: "red" }}>{error}</p>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: displayedText }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={handleInputChange}
              value={input}
              type="text"
              placeholder="Ask Gemini"
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {input ? (
                <img onClick={handleClick} src={assets.send_icon} alt="" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
