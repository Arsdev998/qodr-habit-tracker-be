import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor() {
        super()
        console.log("Local Auth Guard Initialized");
    }

    canActivate(context:ExecutionContext){
        console.log("Local Auth Guard Called");
        return super.canActivate(context)
    }
}
