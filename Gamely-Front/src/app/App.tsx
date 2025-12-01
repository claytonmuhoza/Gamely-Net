import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppThemeProvider } from "./providers/ThemeProvider";
import { CurrentPlayerProvider } from "./providers/CurrentPlayerProvider";
export default function App() {
  return (
    <AppThemeProvider>
      <CurrentPlayerProvider>
         <RouterProvider router={router} />
      </CurrentPlayerProvider>
    </AppThemeProvider>
  );
}
