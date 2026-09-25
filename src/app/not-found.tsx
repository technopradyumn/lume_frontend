import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="page-container"
      style={{
        textAlign: "center",
        padding: "80px 20px",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Page Not Found</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn btn--primary">
        Return Home
      </Link>
    </div>
  );
}
