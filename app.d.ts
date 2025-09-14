declare namespace NodeJS {
  interface Require {
    context(
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp
    ): {
      (key: string): any;
      keys(): string[];
    };
  }
}