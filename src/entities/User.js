import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: String,
      nullable: false,
    },
    email: {
      type: String,
      unique: true,
      nullable: false,
    },
    password: {
      type: String,
      nullable: false,
    },
    createdAt: {
      type: Date,
      createDate: true,
    },
  },
  relations: {
    resources: {
      type: "one-to-many",
      target: "Resource",
      inverseSide: "user",
    },
  },
});
