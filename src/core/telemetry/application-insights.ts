import * as appInsights from 'applicationinsights';
import { envs } from 'src/config/envs';

let started = false;

export function startApplicationInsights() {
  if (started || !envs.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    return;
  }

  appInsights
    .setup(envs.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setSendLiveMetrics(true)
    .start();

  started = true;
}
