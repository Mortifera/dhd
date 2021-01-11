#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'monocdk';
import { StreamDataSyncStack } from '../lib/StreamDataSyncStack';

export const app = new cdk.App();
new StreamDataSyncStack(app, 'DHDStreamDataSyncStack');
