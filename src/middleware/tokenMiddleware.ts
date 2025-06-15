import { NextFunction, Request } from "express";

export async function tokenHandler(req: Request, res: any, next: NextFunction) {
  try {
    if (req.headers["x-token"] === String(process.env.HL_TOKEN)) {
      req[`user`] = { id: req.headers["x-company-id"] };
      return next();
    }

    throw new Error("Unauthorized Access!!");
  } catch (error: any) {
    return res.status(403).json({
      responseCode: "000028",
      responseMessage: error.message,
      status: "Fail",
    });
  }
}
