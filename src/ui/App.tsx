import * as React from "react";
import * as ReactDom from "react-dom";
import {InitializationState} from "../models/IInitializationState";
import {LandingPageComponent} from "../components/LandingPageComponent";
import {ComposerPageComponent} from "../components/ComposerPageComponent";
import {StyleRoot} from "radium";

declare const initializedState: InitializationState;

if (initializedState.pageName === "landing") {
    ReactDom.render(
        <StyleRoot>
            <LandingPageComponent/>
        </StyleRoot>,
        document.getElementById("app-container"));
} else if (initializedState.pageName === "composerSelect") {

} else if (initializedState.pageName === "composer") {
    ReactDom.render(
        <StyleRoot>
            <ComposerPageComponent compositionId={initializedState.compositionId}/>
        </StyleRoot>,
        document.getElementById("app-container"));
}

console.log(`the current page is: ${initializedState.pageName}`);

