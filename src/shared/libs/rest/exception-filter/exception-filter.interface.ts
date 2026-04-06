import { NextFunction, Request, Response } from "express";

export interface ExceptionFilter {
  catch(err: Error, req: Request, res: Response, next: NextFunction): void;
}
