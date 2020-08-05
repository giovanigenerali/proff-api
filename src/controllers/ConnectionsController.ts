import { Request, Response } from "express";

import db from "../database/connection";

export default class ConnectionsController {
  async index(request: Request, response: Response) {
    const totalConnections = await db("connections").count("id as total");

    const { total } = totalConnections[0];

    return response.json(total);
  }

  async create(request: Request, response: Response) {
    const { user_id } = request.body;

    const trx = await db.transaction();

    try {
      await trx("connections").insert({
        user_id,
      });

      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response
        .status(400)
        .json({ error: "Unexpected error while creating new connection" });
    }
  }
}
