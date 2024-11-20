import React from "react"
import { renderToString } from "react-dom/server"

Bun.write(
  "./public/index.html",
  ReactDOM.renderToString(<div>Hello World</div>),
)
