export type MacroType = {
    [key: string]: MacroObjectType;
}

export type MacroObjectType = {
    hotkeys?: number[];
    hotstring?: string;
    loop?: number;
    conditions?: ConditionsType;
    steps: MacroStepType[];
}

export type ConditionsType = {
    window?: string | RegExp;
}

export type MacroStepType = {
    click?: ClickType | number | number[];
    pressKey?: number;
    paste?: string;
    releaseKey?: number;
    type?: string;
    wait?: number;
    func?: FuncType;
}

export type ClickType = {
    key: number;
    modifiers?: number | number[];
    times?: number
}

export type FuncType = (
    tools: ToolsType
) => void

export type ToolsType = {
    pressKey: (keyCode: number) => void,
    releaseKey: (keyCode: number) => void,
    click: (click: ClickType) => void,
    type: (text: string) => void,
    paste: (text: string) => void,
    wait: (milliseconds: number) => void,
    setClipboardText: (text: string) => void,
    getClipboardText: () => string,
    matchCurrentWindowTitle: (title: string | RegExp) => boolean
}


export type KeyStateType = {
    [key: string]: boolean
}