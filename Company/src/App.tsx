import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Dashboard from "./pages/dashboard.tsx";
import NewJob from "./pages/NewJob.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-job" element={<NewJob />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App