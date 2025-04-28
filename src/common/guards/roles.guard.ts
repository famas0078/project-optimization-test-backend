import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { Roles } from '../../db/entities/role.entity';
import { User } from '../../db/entities/user.entity';

export const RolesGuard = (...roles: Roles[]) => {
  class RolesGuardMixin implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      const user = await User.findOne({
        relations: {
          role: true,
        },
        where: {
          id: request.user.id,
        },
      });

      return roles.includes(user.role.id);
    }
  }

  const guard = mixin(RolesGuardMixin);
  return guard;
};
