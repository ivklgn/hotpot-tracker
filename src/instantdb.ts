import { init } from "@instantdb/react";
import schema from "../instant.schema";

export const db = init({
  appId: "bb8b2426-429a-487a-b4ff-c7f87fff5c42",
  schema,
});
