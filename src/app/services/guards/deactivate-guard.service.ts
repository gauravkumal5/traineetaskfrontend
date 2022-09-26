import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

export interface IDeactivateGuard {
    canExit: () => boolean | Promise<boolean> | Observable<boolean>;
}
export class DeactivateGuardService implements CanDeactivate<IDeactivateGuard> {

    canDeactivate(component: IDeactivateGuard,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot, nextState?:
            RouterStateSnapshot | undefined): boolean | Observable<boolean> | Promise<boolean> {
        return component.canExit();
    }
}