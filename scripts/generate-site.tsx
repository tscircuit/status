import React from "react"
import { renderToString } from "react-dom/server"

Bun.write("./public/index.html", renderToString(<div>Hello World</div>))
