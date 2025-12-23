export interface CodemodOptions {
}
export interface File {
    source: string;
    filename: string;
}
export interface Codemod {
    /**
     * The name of the codemod should be equal to the name of the package
     * you're trying to replace
     */
    name: string;
    /**
     * Either "native" or the name of the package you're replacing it with.
     */
    to: "native" | string;
    transform: (options: {
        file: File;
    }) => string | Promise<string>;
}
