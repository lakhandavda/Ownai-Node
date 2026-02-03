import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: 'varchar',
      generated: 'uuid'
    },
    name: {
      type: 'varchar'
    },
    email: {
      type: 'varchar',
      unique: true
    },
    password: {
      type: 'text'
    },
    phone: {
      type: 'varchar',
      nullable: true
    },
    city: {
      type: 'varchar',
      nullable: true
    },
    country: {
      type: 'varchar',
      nullable: true
    },
    role: {
      type: 'varchar',
      default: 'Staff'
    },
    createdAt: {
      type: 'datetime',
      createDate: true
    }
  }
});
