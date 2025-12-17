import * as jwt from 'jsonwebtoken';
import { Role } from 'src/common/enums/role.enum';

export function signEmpleadoToken(payload: { id: string; role: Role }) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
}