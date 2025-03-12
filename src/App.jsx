import EditorContainer from "./components/TextEditor";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-3xl font-bold text-gray-800 mb-4">AI Writing Assistant</div>
      <EditorContainer />
    </div>
  );
}

export default App;
