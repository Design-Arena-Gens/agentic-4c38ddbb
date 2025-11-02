"use client";

import { useEffect, useMemo, useState } from "react";

type PreviewData = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  error?: string;
};

export default function UrlPreview({ defaultUrl }: { defaultUrl: string }) {
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PreviewData | null>(null);
  const isValid = useMemo(() => {
    try {
      const u = new URL(inputUrl);
      return Boolean(u.protocol && u.host);
    } catch {
      return false;
    }
  }, [inputUrl]);

  async function load(url: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      const json = (await res.json()) as PreviewData;
      setData(json);
    } catch (e) {
      setData({ url, error: "Failed to load metadata" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(defaultUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        <input
          className="input"
          placeholder="Enter a URL"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <button className="button" disabled={!isValid || loading} onClick={() => load(inputUrl)}>
          {loading ? "Loading..." : "Preview"}
        </button>
      </div>

      {data && (
        <div className="card">
          <div className="card-header">
            <a className="link" href={data.url} target="_blank" rel="noreferrer">
              {data.url}
            </a>
          </div>
          <div className="card-body">
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.image} alt={data.title ?? "Preview image"} />
            ) : (
              <div style={{
                width: 120,
                height: 120,
                borderRadius: 8,
                background: "#f3f4f6",
                display: "grid",
                placeItems: "center",
                color: "#9ca3af",
              }}>
                No image
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                {data.title ?? "No title found"}
              </div>
              <div style={{ opacity: 0.8, marginBottom: 6 }}>
                {data.description ?? "No description found"}
              </div>
              <div className="mono" style={{ fontSize: 12, opacity: 0.7 }}>
                {data.siteName ?? "Unknown site"}
              </div>
              {data.error && (
                <div style={{ color: "#b91c1c", marginTop: 8 }}>Error: {data.error}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
