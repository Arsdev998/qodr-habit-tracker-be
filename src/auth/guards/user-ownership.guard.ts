import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";


@Injectable()
export class UserOwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const resourceUserId = request.params.userId || user.sub;
        console.log("req params",request.params)
        console.log("req body",request.body);
        if (!user || user.sub !== resourceUserId) {
          throw new ForbiddenException(
            'You are not authorized to access this resource',
          );
        }
        return true
    }
}