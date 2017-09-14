import * as React from "react";
import * as ReactDom from "react-dom";
import {InitializationState} from "../models/IInitializationState";
import {LandingPageComponent} from "../components/pages/LandingPageComponent";
import {RecorderPlayerPageComponent} from "../components/pages/RecorderPlayerPageComponent";
import {StyleRoot} from "radium";
import {ErrorPageComponent} from "../components/pages/ErrorPageComponent";
import {AutoComposePageComponent} from "../components/pages/AutoComposePageComponent";
import {AboutPageComponent} from "../components/pages/AboutPageComponent";

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
            <ErrorPageComponent error={initializedState.error} isProd={initializedState.isProd}/>
        </StyleRoot>,
        document.getElementById("app-container"));
} else if (initializedState.pageName === "auto-compose") {
    ReactDom.render(
        <StyleRoot>
            <AutoComposePageComponent
                isProd={initializedState.isProd}
                editToken={initializedState.editToken}
                viewToken={initializedState.viewToken}/>
        </StyleRoot>,
        document.getElementById("app-container"));
} else if (initializedState.pageName === "about") {
    ReactDom.render(
        <StyleRoot>
            <AboutPageComponent/>
        </StyleRoot>,
        document.getElementById("app-container"));
}


