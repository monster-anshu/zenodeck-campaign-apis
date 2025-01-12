import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

export const Actions = [
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  // manage resource
  'manage',
] as const;

export const Subjects = ['USER', 'ROLE', 'BILLING', 'DASHBOARD'] as const;
export const Status = ['ACTIVE', 'DELETED'] as const;

const ActionSchema = {
  type: String,
  enum: Actions,
};

// permission data
const PermissionSchema = new Schema<Permission>(
  {
    USER: [ActionSchema],
    ROLE: [ActionSchema],
    BILLING: [ActionSchema],
  },
  {
    _id: false,
  }
);

// roles
const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    appId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    permissions: PermissionSchema,
    isSuperAdminRole: { type: Boolean },
    status: { type: String, enum: Status },
    isAutoCreated: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    modifiedBy: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

RoleSchema.path('permissions').transform(function (value: Permission) {
  Subjects.forEach((subject) => {
    const actions = value[subject];
    if (!actions) {
      value[subject] = [];
      return;
    }
    value[subject] = Array.from(new Set(actions));
  });
  return value;
});

export type FullPermission = Record<SubjectType, ActionType[]>;
export type Permission = Partial<FullPermission>;
export type Role = InferSchemaType<typeof RoleSchema>;
export type SubjectType = (typeof Subjects)[number];
export type ActionType = (typeof Actions)[number];

export const RoleModel = MONGO_CONNECTION.DEFAULT.model<Role>(
  'role',
  RoleSchema
);
