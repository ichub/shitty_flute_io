import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont} from "../styles/GlobalStyles";
import {generateShareIcon, ShareButtons, ShareCounts} from "react-share";

const FacebookIcon = generateShareIcon("facebook");
const TwitterIcon = generateShareIcon("twitter");
const GooglePlusIcon = generateShareIcon("google");
const PinterestIcon = generateShareIcon("pinterest");
const VKIcon = generateShareIcon("vk");
const OKIcon = generateShareIcon("ok");
const RedditIcon = generateShareIcon("reddit");

const {
    FacebookShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    PinterestShareButton,
    VKShareButton,
    OKShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    RedditShareButton
} = ShareButtons;

@Radium
export class ShareComponent extends React.Component<IShareComponentProps, IShareComponentState> {
    props: IShareComponentProps;
    state: IShareComponentState;

    refs: {
        urlText: HTMLElement
    };

    render() {
        return (

            <div style={[
                OpenSansFont,
                ShareComponent.styles.base
            ]}>
                <div>
                    <span style={[ShareComponent.styles.sharePreamble]}>
                            share your creation:
                            </span>
                    <span
                        onClick={this.selectText.bind(this)}
                        ref="urlText"
                        style={[ShareComponent.styles.url]}>{`http://floot.io/recorder/view/${this.props.viewToken}`}</span>
                </div>

                <br/>

                <div style={[ShareComponent.styles.flex]}>
                    <div style={[ShareComponent.styles.button]}>
                        <FacebookShareButton
                            url={this.getViewUrl()}
                            quote={""}
                            className="Demo__some-network__share-button">
                            <FacebookIcon
                                size={32}
                                round/>
                        </FacebookShareButton>
                    </div>
                    <div style={[ShareComponent.styles.button]}>
                        <TwitterShareButton
                            url={this.getViewUrl()}
                            quote={""}
                            className="Demo__some-network__share-button">
                            <TwitterIcon
                                size={32}
                                round/>
                        </TwitterShareButton>
                    </div>
                    <div style={[ShareComponent.styles.button]}>
                        <GooglePlusShareButton
                            url={this.getViewUrl()}
                            quote={""}
                            className="Demo__some-network__share-button">
                            <GooglePlusIcon
                                size={32}
                                round/>
                        </GooglePlusShareButton>
                    </div>
                    <div style={[ShareComponent.styles.button]}>
                        <RedditShareButton
                            url={this.getViewUrl()}
                            quote={""}
                            className="Demo__some-network__share-button">
                            <RedditIcon
                                size={32}
                                round/>
                        </RedditShareButton>
                    </div>
                    <div style={[ShareComponent.styles.button]}>
                        <VKShareButton
                            url={this.getViewUrl()}
                            quote={""}
                            className="Demo__some-network__share-button">
                            <VKIcon
                                size={32}
                                round/>
                        </VKShareButton>
                    </div>
                </div>
            </div>
        );
    }

    getViewUrl() {
        return `http://floot.io/recorder/view/${this.props.viewToken}`;
    }

    selectText() {
        if (document["selection"]) {
            const range = document.body["createTextRange"]();
            range.moveToElementText(this.refs.urlText);
            range.select();
        } else if (window.getSelection()) {
            const range = document.createRange();
            range.selectNode(this.refs.urlText);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    private static styles = {
        base: {
            margin: "0 50px 50px 50px"
        },
        flex: {
            justifyContent: "center",
            alignItems: "center",
            display: "flex"
        },
        url: {
            padding: "5px 10px 5px 10px",
            borderRadius: "2px",
            backgroundColor: "rgb(220, 220, 220)",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "15px",
            cursor: "pointer"
        },
        share: {
            margin: "10px",
            cursor: "pointer",
            ":hover": {
                color: "black"
            }
        },
        sharePreamble: {
            opacity: 0.9,
            fontSize: "0.9em",
            height: "100%",
            lineHeight: "100%",
            textAlign: "center",
            marginRight: "10px"
        },
        button: {
            margin: "10px",
            cursor: "pointer"
        }
    };
}

export interface IShareComponentProps {
    viewToken: string;
}

export interface IShareComponentState {

}