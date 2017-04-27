## API Connect CF Route Services Configuration Steps

There are two parts to setup the API Gateway to work with a CF Route Service

1) Update the DataPower framework to handle the necessary URL and Header rewriting. This is done by importing a configuration, more about this below.

2) Update the API Assembly configuration to Invoke the correct backend URL using information from the request context. This is done using standard API Connect Assemble constructs.


### Sequence Diagram

In the sequence below you can see how the incoming request is presented to the DataPower API Gateway and the use of X-CF-* headers to encapsulate the original request.

![diagram](https://raw.githubusercontent.com/ibm-apiconnect/cf-service-broker/master/datapower/api-connect-cf-route-seq.png "API Gateway CF Route Sequence")

To understand more about the purpose of these headers please consult the CF [documentation](https://docs.cloudfoundry.org/services/route-services.html)

### Step 1) Import the URL and Header handling configuration

From [here](https://raw.githubusercontent.com/ibm-apiconnect/cf-service-broker/master/datapower/cf-integration.zip) download the DataPower import configuration and import using the DataPower UI.

![diagram](https://raw.githubusercontent.com/ibm-apiconnect/cf-service-broker/master/datapower/api-connect-cf-route-import-1.png "API Gateway CF Route Sequence")

Click Next, select cf-integration domain and click next.

![diagram](https://raw.githubusercontent.com/ibm-apiconnect/cf-service-broker/master/datapower/api-connect-cf-route-import-2.png "API Gateway CF Route Sequence")

Click done. Switch to the cf-integration domain and view the MPGW configuration.

![diagram](https://raw.githubusercontent.com/ibm-apiconnect/cf-service-broker/master/datapower/api-connect-cf-route-import-3.png "API Gateway CF Route Sequence")

From here take note of the HTTP Front Side Protocol details (default is to listen on port 7090). At this point your free to change the configuration, enabled TLS for example. Take note of the **ip** and **port** information as this will be required to configure the Service Broker later on.

### Step 2) Update the API Connect API Assemble definition

Log into the API Connect API Manager and select your API definition. From here you'll need to update the Assemble

![diagram](https://raw.githubusercontent.com/ibm-apiconnect/cf-service-broker/master/datapower/api-connect-cf-route-assemble-1.png "API Assemble")

![diagram](https://raw.githubusercontent.com/ibm-apiconnect/cf-service-broker/master/datapower/api-connect-cf-route-assemble-2.png "API Assemble")

See below in the source the need to prevent propagation of the x-cf-forwarded-url using a `set-variable` policy and the need to use an `Invoke` or `Proxy` policy to route back to the CF Application using the x-cf-forwarded-url endpoint.

![diagram](https://raw.githubusercontent.com/ibm-apiconnect/cf-service-broker/master/datapower/api-connect-cf-route-assemble-3.png "API Assemble")
