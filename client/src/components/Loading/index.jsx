import React from "react";
import "./Loading.css";

export default function loading() {
  return (
    <div>
      <h1>Loading...</h1>
      <img
        className="loading"
        src="https://www.gifsanimados.org/data/media/288/oveja-imagen-animada-0101.gif"
        alt="Not found"
      />
      <h1>Please wait</h1>
    </div>
  );
}
