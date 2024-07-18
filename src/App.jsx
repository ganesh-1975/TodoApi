import Form from "./components/Form";

const firebaseurl =
  "https://first-project-47250-default-rtdb.asia-southeast1.firebasedatabase.app/";

function App() {
  return (
    <>
      <Form url={firebaseurl} />
    </>
  );
}

export default App;
