import "core-js";
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";
import "zone.js/dist/proxy.js";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";

import "hammerjs";
import "rxjs";
import "reflect-metadata";
import "zone.js/dist/zone";

import "@angular/common";
import "@angular/compiler";
import "@angular/core";
import "@angular/forms";
import "@angular/http";
import "@angular/platform-browser";
import "@angular/platform-browser-dynamic";
import "@angular/router";
import "@angular/material";

import "@ngx-translate/core";
import "@ngx-translate/http-loader";
import "web-animations-js";

import { TestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";

// First, initialize the Angular testing environment.
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
const context = (require as any).context("../app/", true, /\.spec\.ts$/);
context.keys().map(context);

