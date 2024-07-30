import Form from "./components/Form";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import Intro from "./components/Intro";

const firebaseurl =
  "https://first-project-47250-default-rtdb.asia-southeast1.firebasedatabase.app/";

function App() {
  return (
    <>
      <div className="border-b py-3 ">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-5">
          <h1 className="text-xl font-bold">Todo App</h1>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
        </div>
      </div>
      <SignedIn>
        <Form url={firebaseurl} />
      </SignedIn>
      <SignedOut>
        <Intro />
      </SignedOut>
    </>
  );
}

export default App;
