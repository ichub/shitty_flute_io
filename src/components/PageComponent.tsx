import * as React from "react";

export class PageComponent extends React.Component<any, IPageComponentState> {
    public state: IPageComponentState;

    constructor(props) {
        super();

        this.state = {
            requests: [],
        };
    }

    public render() {
        return (
            <div>
                {
                }
            </div>
        );
    }
}

export interface IPageComponentState {
}