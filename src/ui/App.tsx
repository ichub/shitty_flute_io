import * as React from "react";
import * as ReactDom from "react-dom";
import {PageComponent} from "../components/PageComponent";
import {InitializationState} from "../models/IInitializationState";
import {LandingPageComponent} from "../components/LandingPageComponent";

declare var initializedState: InitializationState;

if (initializedState.pageName === "landing") {
    ReactDom.render(<LandingPageComponent/>, document.getElementById("app-container"));
} else if (initializedState.pageName === "composerSelect") {

} else if (initializedState.pageName === "composer") {
    ReactDom.render(<PageComponent/>, document.getElementById("app-container"));
}

console.log(initializedState.pageName);

