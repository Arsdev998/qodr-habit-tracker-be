declare module 'passport-local' {
  import { Strategy as PassportStrategy } from 'passport';
  import { Request } from 'express';

  interface IStrategyOptions {
    usernameField?: string;
    passwordField?: string;
    passReqToCallback?: boolean;
  }

  interface VerifyFunction {
    (
      username: string,
      password: string,
      done: (error: any, user?: any, options?: { message: string }) => void,
    ): void;
  }

  interface VerifyFunctionWithRequest {
    (
      req: Request,
      username: string,
      password: string,
      done: (error: any, user?: any, options?: { message: string }) => void,
    ): void;
  }

  export class Strategy extends PassportStrategy {
    constructor(
      options: IStrategyOptions,
      verify: VerifyFunction | VerifyFunctionWithRequest,
    );
  }
}
