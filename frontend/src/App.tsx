import Header from "./components/main/header";
import BodySection from "./components/main/body";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Button } from "./components/ui/button";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <div className="flex h-[45vh] my-16 justify-center items-center">
        <div className="w-[83vw] text-lg leading-relaxed">
          <a href="https://www.ii.uib.no/saga/SC96EPR/stagecoach.html">
            <p>
              " The stagecoach problem is a classical problem in dynamic
              programming. The background for this problem is said to be a
              salesman in the wild west. He was travelling from a small town S
              to another small town T, but did not want to pay more for the
              transport than necessary. The means of transportation was
              stagecoaches, that were scheduled between the small towns in the
              area. The cost of travel was to be found by adding together the
              cost of the individual distances. "
            </p>
          </a>
        </div>
      </div>
      <div className="flex justify-center items-center animate-bounce">
        <a href="#main">
          <Button variant="ghost" size="icon">
            <ChevronDown />
          </Button>
        </a>
      </div>
      <BodySection />
      <div className="fixed bottom-2 right-1 h-10 w-10 flex justify-center items-center animate-appear-from-below">
        <a href="#header">
          <Button variant="ghost" size="icon">
            <ChevronUp />
          </Button>
        </a>
      </div>
    </ThemeProvider>
  );
}

export default App;
