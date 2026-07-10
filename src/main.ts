/**
 * This class intialize CMS LAUNCHPAD MODULE
 */

import 'core-js/features/reflect';
// import "zone.js/dist/zone";

import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CmsLaunchapadModule } from './app/launchpad/cms-launchpad.module';

enableProdMode();
platformBrowserDynamic().bootstrapModule(CmsLaunchapadModule, { applicationProviders: [provideZoneChangeDetection()] });
