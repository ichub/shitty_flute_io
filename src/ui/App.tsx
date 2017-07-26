import * as React from "react";
import * as ReactDom from "react-dom";
import {InitializationState} from "../models/IInitializationState";
import {LandingPageComponent} from "../components/pages/LandingPageComponent";
import {RecorderPlayerPageComponent} from "../components/pages/RecorderPlayerPageComponent";
import {StyleRoot} from "radium";
import {ErrorPageComponent} from "../components/pages/ErrorPageComponent";

declare const initializedState: InitializationState;

if (initializedState.pageName === "landing") {
    ReactDom.render(
        <StyleRoot>
            <LandingPageComponent/>
        </StyleRoot>,
        document.getElementById("app-container"));
} else if (initializedState.pageName === "recorder") {
    ReactDom.render(
        <StyleRoot>
            <RecorderPlayerPageComponent editToken={initializedState.editToken} viewToken={initializedState.viewToken}
                                         viewOnly={false}/>
        </StyleRoot>,
        document.getElementById("app-container"));
} else if (initializedState.pageName === "recorder-view") {
    ReactDom.render(
        <StyleRoot>
            <RecorderPlayerPageComponent viewToken={initializedState.viewToken} viewOnly={true}/>
        </StyleRoot>,
        document.getElementById("app-container"));
} else if (initializedState.pageName === "error") {
    ReactDom.render(
        <StyleRoot>
            <ErrorPageComponent code={initializedState.error.code} message={initializedState.error.message}/>
        </StyleRoot>,
        document.getElementById("app-container"));
}

console.log(`the current page is: ${initializedState.pageName}`);

