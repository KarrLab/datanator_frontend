import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/@blueprintjs/select/lib/css/blueprint-select.css";
import "../node_modules/@blueprintjs/table/lib/css/table.css";
import "../node_modules/@blueprintjs/core/lib/scss/variables.scss";

import {Home} from '~/scenes/Home/Home';


ReactDOM.render(<Home/>,document.getElementById("root"));    