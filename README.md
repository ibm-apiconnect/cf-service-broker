# API Connect Route Service Broker

This is a sample application designed to handle binding of applications in a Cloud Foundry environment to an API Connect API.

#### Installation
##### Prerequisites:
- [NodeJS (v4.0.0+)](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- Git Shell

##### Deployment:
The broker can be deployed by cloning this respository to the server that will host the application.
```
$ git clone git@github.com:ibm-apiconnect/cf-service-broker.git
```

##### Setup
From the cloned project, run the following commands to download neccesary dependencies and build the application.
```
$ npm install
$ npm run build
```

##### Configuration
Many configuration values can be configured by changing environment variables before starting the application. This can be accomplished in two ways:
1. Edit `configs/config-base.yaml` to include necessary changes
2. Pass environment variables directly to the application when starting it.

    _Note: To include nested objects in your configuration at runtime, use `__` as a seperator. (eg. To modify logger >> level, use `logger__level=trace`)_

Examples of configuration values:
```
- PORT: Port on which the application should listen
- logger
  | - level: How verbose should the application logs be
- apimanager
  | - managementServer: Address of the API Connect Management Node to query
  | - gatewayServer: Address of API Connect Gateway Node. This is used as a default when programatically binding an application.
  | - username: Default API Connect credentials to be used in the UI
  | - password: Default API Connect credentials to be used in the UI
- cf
  | - server: Cloud Foundry API server
  | - token: Default CF token to be used in the UI
- broker
  | - dashboardUrl: Location at which this application is accessible (for use in returning dashbord_url on provision
```
_Note: Server and credential values provided above are used as defaults in the UI. The user has the option to overwrite them directly in the UI._

##### Run
To run the application, simply run the following command from the root directory of the application
```
$ npm start
```
Once running, you should see the following line in the logs:
```
[2017-04-27T18:07:54.296Z]  INFO: app/11931 on mbp: CF Service Broker started on port 3000
```

#### Use
This application is intended to be registered as a service broker within a CF environment. For more details on how to do that, [click here](https://docs.cloudfoundry.org/services/managing-service-brokers.html#register-broker).

Once registered, users within the CF environment will have the ability to provision an instance of the service broker from the CF catalog. Doing so will provide them with a service instance to which they can bind routes from other CF applications.

Prior to binding an application route, you will need to perform applicable setup steps within API Connect. You will need the following items created and accessible from a single user:
* A Provider Organization
* A Catalog
* An API with the applicable DataPower policy used within the API's assembly. (More information on what needs to be done for this step can be found [here](https://github.com/ibm-apiconnect/cf-service-broker/blob/master/datapower/README.md)

Once ready, there are two different ways to bind your application route to an API:

##### UI
Post provision, you will be redirected to the route service console. From this application, you can discover and select applicable API Connect and CF artifacts. In order to use the application, you need to login to both CF and API Connect.

In order to log in to API Connect, select 'APIC Login' in the upper right corner. From here, you'll need to provide the API Connect management node and the credentials to connect.

In order to log in to CF, select 'CF Login' in the upper right corner. From here, you'll need to provide your CF token. You can log into CF running `cf login` from your terminal. After logging in, you can capture your token in the CF config file located at `~/.cf/config.json`. The token is located within the `AccessToken` key.

After logging in, you can select which artifacts you would like to use via the dropdowns provided. Upon selecting a value for each dropdown, calls will be made to populate the subsequent dropdowns. Once all artifacts are selected the 'Bind' button will become enabled. Clicking this button will execute the required CF call to bind the application to the API.

##### CLI
Using the CF API, you can use the bind route service command to supply API information.
```
$ cf bind-route-service <domain> <service_instance> --hostname <domain_hostname> -c <bind_parameters>

* domain - CF Domain
* service_instance - Service instance name of provisioned tile
* domain_hostname - Application subdomain
* bind_parameters - JSON object containing details required for bind. Users can either provide
 -- 'targetUrl': Full url of API hosted on the gateway
or
 -- 'providerOrg': Provider organization shortname
 -- 'catalogId': Catalog shortname
 -- 'basePath': API base path
 -- 'gatewayUrl': URL for the API Connect gateway node. This is only required if not provided as an environment variable
```
