import { EntitySchema } from 'typeorm';

export const Resource = new EntitySchema({
  name: 'Resource',
  tableName: 'resources',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    resourceUrl: {
      type: String,
      nullable: false
    },
    accessToken: {
      type: String,
      nullable: false,
      unique: true
    },
    expirationTime: {
      type: Date,
      nullable: false
    },
    isExpired: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      createDate: true
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true
    }
  }
});