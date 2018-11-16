import React from "react";

export const ErrorBoundary = ({ error, info }) => {
  return (
    <div>
      <h2>Something went wrong.</h2>
      <details style={{ whiteSpace: "pre-wrap" }}>
        {error && error.toString()}
        <br />
        {info && info.componentStack}
      </details>
    </div>
  )
}
