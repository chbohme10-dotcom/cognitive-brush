import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AudioEditor from "./pages/AudioEditor";
import VideoEditor from "./pages/VideoEditor";
import StoryboardEditor from "./pages/StoryboardEditor";
import CharacterEditor from "./pages/CharacterEditor";
import PropsEditor from "./pages/PropsEditor";
import SceneEditor from "./pages/SceneEditor";
import ScriptEditor from "./pages/ScriptEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/audio" element={<AudioEditor />} />
          <Route path="/video" element={<VideoEditor />} />
          <Route path="/storyboard" element={<StoryboardEditor />} />
          <Route path="/character" element={<CharacterEditor />} />
          <Route path="/props" element={<PropsEditor />} />
          <Route path="/scene" element={<SceneEditor />} />
          <Route path="/script" element={<ScriptEditor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
