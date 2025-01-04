/*instrumentation.ts*/
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {  PeriodicExportingMetricReader,  ConsoleMetricExporter,} from '@opentelemetry/sdk-metrics';

import * as opentelemetry from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';

  //Specify zipkin url. default url is http://localhost:9411/api/v2/spans
  const zipkinUrl = 'http://localhost';
  const zipkinPort = '9411';
  const zipkinPath = '/api/v2/spans';
  const zipkinURL = `${zipkinUrl}:${zipkinPort}${zipkinPath}`;

  const options = {
    headers: {
	'module': 'mainai16z',
    },
    url: zipkinURL,
    //serviceName: 'your-application-name',   
   
    // optional interceptor
    getExportRequestHeaders: () => {
      return {
        'module': 'mainai16z',
      }
    }
  }
const traceExporter_zipkin = new ZipkinExporter(options);
// parts from https://stackoverflow.com/questions/71654897/opentelemetry-typescript-project-zipkin-exporter

const sdk = new NodeSDK({
    //traceExporter: new ConsoleSpanExporter(),
    traceExporter: traceExporter_zipkin,
    metricReader: new PeriodicExportingMetricReader({
	exporter: new ConsoleMetricExporter(),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

import "./App.css";
//import "./otelapis";
import Agents from "./Agents";

function App() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Agents />
        </div>
    );
}

export default App;
