export interface IFluteButtonInfo {
    name: string;
}

export function makeIFluteButtonInfo(name: string) {
    return {
        name: name,
    };
}