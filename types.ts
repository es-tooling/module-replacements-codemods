export interface SourceMap {
  file?: string;
  mappings: string;
  names: string[];
  sourceRoot?: string;
  sources: string[];
  sourcesContent?: string[];
  version: number;
}

export interface Pos {
  /** line number starting from 0 */
  line: number;
  /** column number starting from 0 */
  column: number;
  /** byte offset of the position */
  index: number;
}

export interface Range {
  /** starting position of the range */
  start: Pos;
  /** ending position of the range */
  end: Pos;
}

/**
 * Used to show warnings with links to relevant lines
 */
export interface Warning {
  range?: Range;
  file?: string;
  message: string;
  stack?: string;
}

export interface CodemodMeta {
  /**
   * @example { "lodash": "lodash-es" }
   */
  replacements?: Record<string, string>;
  warnings?: Warning[];
}

export interface TransformResult extends CodemodMeta {
  map?: SourceMap | string | null | { mappings: "" };
  code: string;
}

export interface CodemodOptions {
  strict?: boolean;
}

export interface File {
  source: string;
  filename: string;
}

export interface File {
  source: string;
  filename: string;
}

type KnownAstLibs = "recast" | "typescript" | "jscodeshift" | (string & {});

export interface Codemod {
  /**
   * The name of the codemod should be equal to the name of the package
   * you're trying to replace
   */
  name: string;
  /**
   * setting this enables the consumer of the codemod to pass in options that can be used in this codemod
   * e.g. (and specifically) sourceFileName and sourceMapName of recast.Options for automated sourcemap generation
   */
  astlib?: KnownAstLibs;
  transform: (options: {
    file: File;
    options?: Record<string, any>;
  }) => string | Promise<string> | TransformResult | Promise<TransformResult>;
}
