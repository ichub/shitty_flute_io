import * as React from "react";
import * as ReactDom from "react-dom";
import {PageComponent} from "../components/PageComponent";
import {InitializationState} from "../models/IInitializationState";
import {LandingPageComponent} from "../components/LandingPageComponent";

declare const initializedState: InitializationState;

if (initializedState.pageName === "landing") {
    ReactDom.render(<LandingPageComponent/>, document.getElementById("app-container"));
} else if (initializedState.pageName === "composerSelect") {

} else if (initializedState.pageName === "composer") {
    ReactDom.render(
        <PageComponent compositionId={initializedState.compositionId}/>,
        document.getElementById("app-container"));
}

console.log(`the current page is: ${initializedState.pageName}`);

