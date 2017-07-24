/**
 * Created by bgu on 7/22/17.
 */

export interface INoteUIPosition {
    keyboardCharacter: string;
    index: number;
    isMinor: boolean;
    isDummy: boolean;
}

export function makeINoteUIPosition(keyboardCharacter: string, index: number, isMinor: boolean, isDummy: boolean) {
    return {
        keyboardCharacter: keyboardCharacter,
        index: index,
        isMinor: isMinor,
        isDummy: isDummy
    };
}