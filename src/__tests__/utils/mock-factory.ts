import { Request, Response } from "express";

/**
 * Factory to create mock Express Request and Response objects for testing.
 */
export const createMockReqRes = (options: {
  params?: any;
  body?: any;
  query?: any;
} = {}) => {
  const jsonMock = jest.fn();
  const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

  const req = {
    params: options.params || {},
    body: options.body || {},
    query: options.query || {},
  } as Partial<Request>;

  const res = {
    status: statusMock,
    json: jsonMock,
  } as Partial<Response>;

  return {
    req: req as Request,
    res: res as Response,
    statusMock,
    jsonMock,
  };
};
