const g_exportPrivateFunc = {};


export function exportFunc4UnitTest(fileName: string, exportObj: any) {
    g_exportPrivateFunc[fileName] = exportObj;
}

export function importFunc4UnitTest<T>(fileName: string): T {
    const ret = g_exportPrivateFunc[fileName];
    if (!ret) {
        throw new Error(`konnte ${fileName} nicht gefunden`);
    }
    return ret;
}

export function isUnitTest(): boolean {
    if (process && process.env["NODE_ENV"]=="test") {
        return true;
    }
    return false;
}

