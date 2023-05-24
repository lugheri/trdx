import { AuthProvider } from "./contexts/auth";
import { ThemeProvider } from "./contexts/theme";
import RoutesApp from "./routes";

const App = () => {  
   return (
    <ThemeProvider>
      <AuthProvider>
        <RoutesApp/>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App
