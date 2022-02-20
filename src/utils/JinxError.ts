export const JinxErrorKeys: JinxErrorKeysType = {
    "NO_MODULE_NAME": "Module name cannot be empty.",
    "NOT_AN_INSTANCE": (type) => `Module isn't an instance of the ${type}.`,
    "NO_ID": (action) => `Module id is needed to ${action}.`,
    "NO_FILE_PATH": "The file path is required to load the module."
};

export type JinxErrorKeysType = {
    [index in JinxErrorKeysTypeKeys]: string | Function;
};

export type JinxErrorKeysTypeKeys = 
"NO_MODULE_NAME" |
"NOT_AN_INSTANCE" |
"NO_ID" |
"NO_FILE_PATH";

export class JinxError extends Error {
    constructor (key: keyof (typeof JinxErrorKeys), ...args) {
        var message = JinxErrorKeys[key];
        
        if (typeof (message) === "function") {
            message = message(...args);
        };

        super(message as string);
    };
};