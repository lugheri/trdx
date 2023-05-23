import { AuthProvider } from "./contexts/auth";
import RoutesApp from "./routes";


const App = () => {
   return (
    <AuthProvider>
      <RoutesApp/>
    </AuthProvider>
  );
}

export default App
