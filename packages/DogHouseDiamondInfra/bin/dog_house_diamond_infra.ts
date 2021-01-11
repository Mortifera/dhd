#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'monocdk';
import { DHDStack } from "../lib/DHDStack";

export const app = new cdk.App();
new DHDStack(app, 'DogHouseDiamondStack');
