import { useState } from "react";
import "./App.css";
import { useUser } from "./UserContext";
import { Is } from "./is";
import { IsPreview, useIsPreview } from "./isPreview";

const port = import.meta.env.MODE === "production" ? 4173 : 5173;

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useUser()!;

  return (
    <>
      <h1>
        &lt;Is&gt;{" "}
        <small>
          <a href="https://github.com/ArnoSaine/is">GitHub: ArnoSaine/is</a>
        </small>
      </h1>
      <div className="cards">
        <div className="card">
          <h2>Auth state & roles</h2>
          <Is
            authenticated
            fallback={
              <>
                <button
                  onClick={() =>
                    setUser({
                      name: "demo",
                    })
                  }
                >
                  Login as regular user
                </button>
                <button
                  onClick={() =>
                    setUser({
                      name: "admin",
                      roles: ["admin"],
                    })
                  }
                >
                  Login as admin
                </button>
              </>
            }
          >
            <button onClick={() => setUser(null)}>Logout</button>
          </Is>
          <p>
            <Is authenticated fallback="Hi! Please log in.">
              Hi, <strong>{user?.name}</strong>!
            </Is>
          </p>
          <p>
            <Is
              role="admin"
              fallback={
                <em>Admin role is not assigned or user is not logged in</em>
              }
            >
              <em>Admin role is assigned</em>
            </Is>
          </p>
        </div>

        <div className="card">
          <h2>Feature flags & preview mode</h2>
          <p>Try other URLs for different modes and features:</p>
          <p>
            <Is
              local
              fallback={
                <>
                  <a href="/is/vite-project/">release</a>,{" "}
                  <a href="/is/vite-project/preview/">preview</a>,{" "}
                  <a href="/is/vite-project/example.com/">example.com</a>,{" "}
                  <a href="/is/vite-project/acme.com/">acme.com</a>
                </>
              }
            >
              <a href={`//localhost:${port}`}>release</a>,{" "}
              <a href={`//preview.localhost:${port}`}>preview</a>,{" "}
              <a href={`//example.com.localhost:${port}`}>example.com</a>,{" "}
              <a href={`//acme.com.localhost:${port}`}>acme.com</a>
            </Is>
          </p>
          <Is
            preview
            fallback={
              <em>You are in release mode. Only some features are enabled.</em>
            }
          >
            <em>You are in preview mode. All features are enabled!</em>
          </Is>
          <p>
            <Is feature="counter" fallback={<em>Counter is disabled</em>}>
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
            </Is>
          </p>
          <p>
            <Is feature="other" fallback={<em>Other feature is disabled</em>}>
              [Other feature goes here]
            </Is>
          </p>
        </div>

        <div className="card">
          <h2>Shortcut components & hooks</h2>
          <p>
            <IsPreview fallback={<em>You are in release mode</em>}>
              <em>You are in preview mode</em>
            </IsPreview>
          </p>
          <p>
            Preview mode: <code>{JSON.stringify(useIsPreview())}</code>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
