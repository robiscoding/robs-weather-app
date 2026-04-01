import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  return (
    <>
      <section id="center">
        <div>
          <h1>Get started</h1>
          <Button onClick={() => alert("Hello, world!")}>Click me</Button>
        </div>
      </section>
    </>
  );
}

export default App;
