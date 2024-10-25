import { useDarkMode } from "../Hooks/useDarkMode";

const DarkTheme = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <button
      onClick={() => toggleTheme}
      className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
    >
      {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default DarkTheme;
