import * as React from "react";
import * as ReactDom from "react-dom";
import {InitializationState} from "../models/IInitializationState";
import {LandingPageComponent} from "../components/pages/LandingPageComponent";
import {ComposerPageComponent} from "../components/pages/ComposerPageComponent";
import {RecorderPlayerPageComponent} from "../components/pages/RecorderPlayerPageComponent";
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
            <ComposerPageComponent editToken={initializedState.editToken}/>
        </StyleRoot>,
        document.getElementById("app-container"));
} else if (initializedState.pageName === "composer-view") {

} else if (initializedState.pageName === "recorder") {
    ReactDom.render(
        <StyleRoot>
            <RecorderPlayerPageComponent editToken={initializedState.editToken} viewOnly={false}/>
        </StyleRoot>,
        document.getElementById("app-container"));
} else if (initializedState.pageName === "recorder-view") {
    ReactDom.render(
        <StyleRoot>
            <RecorderPlayerPageComponent viewToken={initializedState.viewToken} viewOnly={true}/>
        </StyleRoot>,
        document.getElementById("app-container"));
}

console.log(`the current page is: ${initializedState.pageName}`);

