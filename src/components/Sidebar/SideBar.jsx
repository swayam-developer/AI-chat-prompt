import "../Sidebar/SideBar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/Context";

const SideBar = () => {
  const [extended, setExtended] = useState(false);
  const { newChat } = useContext(AppContext);
  return (
    <div className={`sidebar ${extended ? "extended" : ""}`}>
      {/* Top Section with Menu */}
      <div className="top">
        <img
          className="menu"
          src={assets.menu_icon}
          alt="Menu"
          onClick={() => setExtended(!extended)} // Toggle sidebar
        />
      </div>

      {/* New Chat Section */}
      <div onClick={() => newChat()} className="new-chat">
        <img src={assets.plus_icon} alt="New Chat" />
        {extended && <p>New Chat</p>}
      </div>

      {/* Recent Chats Section */}
      {extended && (
        <div className="recent">
          <p className="recent-title">Recent</p>
          {/* Recent section */}
          <div className="recent-entry">
            <img src={assets.message_icon} alt="Message" />
            <p>No recent Prompts...</p>
          </div>
        </div>
      )}

      {/* Bottom Section (Help, Activity, Settings) */}
      <div className="bottom">
        <div className="bottom-item">
          <img src={assets.question_icon} alt="Help" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item">
          <img src={assets.history_icon} alt="Activity" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item">
          <img src={assets.setting_icon} alt="Settings" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
