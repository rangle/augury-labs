import { Routes } from '@angular/router';

import { homeRoutes } from './features/home/home.routes';
import { hoverDemoRoutes } from './features/hover-demo/hover-demo.routes';
import { onPushDemoRoutes } from './features/on-push-demo/on-push-demo.routes';
import { outsideAngularDemoRoutes } from './features/outside-angular-demo/outside-angular-demo.routes';
import { trackByDemoRoutes } from './features/track-by-demo/track-by-demo.routes';

export const appRoutes: Routes = [
  {
    pathMatch: 'full',
    path: '',
    redirectTo: 'home',
  },
  ...homeRoutes,
  ...hoverDemoRoutes,
  ...onPushDemoRoutes,
  ...outsideAngularDemoRoutes,
  ...trackByDemoRoutes,
];
