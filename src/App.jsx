import SideBar from "./components/Sidebar/SideBar.jsx";
import Main from "./components/Main/Main.jsx";
import "./app.css";

const App = () => {
  return (
    <div className="app">
      <SideBar />
      <Main />
    </div>
  );
};

export default App;