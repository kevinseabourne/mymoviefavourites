import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
body {
  height: 100%;
  width: 100%;
  margin: 0;
  background-color: #17181b;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  color: #f5f5eb;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: 2px;
  line-height: 1.4;
  height: 100vh;
  scroll-snap-type: y mandatory;
}

html {
  scroll-behavior: smooth;
}

span {
  letter-spacing: 0px;
}

button {
  background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
}

code {
  font-family: "Source Sans Pro", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
}

h1,
h2,
h3,
h4,
h5 {
  margin: 0;
}

`;
