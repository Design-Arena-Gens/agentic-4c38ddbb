import UrlPreview from "../components/UrlPreview";

const DEFAULT_URL = "https://lovable.dev/projects/1b4afbf4-9a33-44c5-8729-12137c6bf0da";

export default function Page() {
  return (
    <main>
      <h1 style={{ marginBottom: 8 }}>Lovable Project Previewer</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Paste a URL or use the default below to preview metadata.
      </p>
      <UrlPreview defaultUrl={DEFAULT_URL} />
      <footer>
        Built for <span className="mono">agentic-4c38ddbb</span>
      </footer>
    </main>
  );
}
