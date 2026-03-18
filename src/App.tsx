import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListeCours from "./pages/ListeCours";
import PageCours from "./pages/PageCours";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListeCours />} />
        <Route path="/cours/:id" element={<PageCours />} />
      </Routes>
    </BrowserRouter>
  );
}
