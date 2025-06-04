import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommentPage from "./pages/CommentPage";
import Index from "#src/pages";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/comments/:materialId" element={<CommentPage />} />
        </Routes>
    </BrowserRouter>
);

export default App;
