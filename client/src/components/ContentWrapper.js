import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import FaCheckSquareO from 'react-icons/lib/fa/check-square-o';
import base64 from 'base-64';

class ContentWrapper extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: {

      }
    };
  }

  handleChange(field) {
    return evt => {

      let value = evt.target.value;

      this.setState({
        [field]: value,
      });

      switch(field) {
        case 'selectedProviderOrg':
          this.fetchApicCatalogs(value);
          break;
        case 'selectedCatalog':
          this.fetchApicApis(this.state.selectedProviderOrg, value);
          break;
        case 'selectedCfApp':
          this.fetchCfRoutes(value);
          break;
      }

    };
  }

  setLoading(field, isLoading) {
    this.setState({
      loading: Object.assign({}, this.state.loading, {
        [field]: isLoading,
      }),
    });
  }

  fetchApicOrgs(config) {
    this.setLoading('apicOrgs', true);
    console.log('fetching APIC orgs');
    if (!config) {
      config = this.state.mgmtConfig;
    }
    if (config.managementServer && config.username && config.password) {
      let auth = base64.encode(`${config.username}:${config.password}`);
      fetch('/mgmt/orgs', {
        headers: {
          managementServer: config.managementServer,
          authorization: `Basic ${auth}`,
        },
      })
        .then(result => result.json())
        .then(orgs => {
          this.setState({
            providerOrgs: orgs,
          });
          this.setLoading('apicOrgs', false);
        });
    } else {
      console.log('missing value in fetchApicOrgs...skipping');
    }
  }

  fetchApicCatalogs(orgId, config) {
    this.setLoading('apicCatalogs', true);
    console.log(`fetching APIC catalogs for org: ${orgId}`);
    if (!config) {
      config = this.state.mgmtConfig;
    }
    if (config.managementServer && config.username && config.password) {
      let auth = base64.encode(`${config.username}:${config.password}`);
      fetch(`/mgmt/orgs/${orgId}/catalogs`, {
        headers: {
          managementServer: config.managementServer,
          authorization: `Basic ${auth}`,
        },
      })
        .then(result => result.json())
        .then(catalogs => {
          this.setState({
            catalogs: catalogs,
          });
          this.setLoading('apicCatalogs', false);
        });
    } else {
      console.log('missing value in fetchApicCatalogs...skipping');
    }
  }

  fetchApicApis(orgId, catalogId, config) {
    this.setLoading('apicApis', true);
    console.log(`fetching APIC apis for org: ${orgId}; catalog: ${catalogId}`);
    if (!config) {
      config = this.state.mgmtConfig;
    }
    if (config.managementServer && config.username && config.password) {
      let auth = base64.encode(`${config.username}:${config.password}`);
      fetch(`/mgmt/orgs/${orgId}/catalogs/${catalogId}/apis`, {
        headers: {
          managementServer: config.managementServer,
          authorization: `Basic ${auth}`,
        },
      })
        .then(result => result.json())
        .then(apis => {
          apis = apis.map(api => {
            if(api.apiEndpoints && api.apiEndpoints.length){
              api.targetUrl = api.apiEndpoints[0].endpointUrl;
            } else {
              api.targetUrl = api.apiEndpoint;
            }
            return api;
          });
          this.setState({
            apis: apis,
          });
          this.setLoading('apicApis', false);
        });
    } else {
      console.log('missing value in fetchApicApis...skipping');
    }
  }

  fetchCfApps(config) {
    this.setLoading('cfApps', true);
    console.log('fetching CF apps');
    if (!config) {
      config = this.state.cfConfig;
    }
    if(config.server && config.token) {
      fetch(`/cf/apps`, {
        headers: {
          server: config.server,
          authorization: config.token,
        },
      })
        .then(result => result.json())
        .then(apps => {
          this.setState({
            cfApps: apps,
          });
          this.setLoading('cfApps', false);
        });
    } else {
      console.log('missing value in fetchCfApps...skipping');
    }
  }

  fetchCfRoutes(appId, config) {
    this.setLoading('cfRoutes', true);
    console.log(`fetching CF routes for app: ${appId}`);
    if (!config) {
      config = this.state.cfConfig;
    }
    if(config.server && config.token) {
      fetch(`/cf/apps/${appId}/routes`, {
        headers: {
          server: config.server,
          authorization: config.token,
        },
      })
        .then(result => result.json())
        .then(routes => {
          this.setState({
            cfRoutes: routes,
          });
          this.setLoading('cfRoutes', false);
        });
      } else {
        console.log('missing value in fetchCfRoutes...skipping');
      }
  }

  handleBind() {
    this.setLoading('bind', true);
    let routeId = this.state.selectedCfRoute;
    let targetUrl = this.state.selectedApi;
    console.log(`in handleBind. routeId: ${routeId}; targetUrl: ${targetUrl}`);
    fetch(`/cf/routes/${routeId}/bind`, {
      method: 'post',
      headers: {
        server: this.state.cfConfig.server,
        authorization: this.state.cfConfig.token,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        targetUrl: targetUrl,
      }),
    })
      .then(result => result.json())
      .then(result => {
        this.setLoading('bind', false);
        this.setState({
          bindComplete: true,
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
    this.fetchApicOrgs(nextProps.mgmtConfig);
    this.fetchCfApps(nextProps.cfConfig);
  }

  render() {
    return (
      <div className='container'>
        <Grid>
          <form>
            <Row>
              <Col md={5}>
                <Row>
                  <h2>CF</h2>
                </Row>
                <Row>
                  {this.props.isCFLoggedIn ? <p>Logged in to {this.props.cfConfig.server}</p> : <p>Please log in to CF to continue</p>
                  }
                </Row>
                <br />
                {this.props.isCFLoggedIn &&
                  <div>
                    <Row>
                      <FormGroup controlId="mgmtArtifacts-cfApp">
                        <Row>
                          <Col md={8}>
                            <ControlLabel>CF Application</ControlLabel>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={8}>
                          <FormControl componentClass="select" value={this.state.selectedCfApp} onChange={this.handleChange('selectedCfApp').bind(this)}>
                            <option value="">Select an application</option>
                            {this.state.cfApps && this.state.cfApps.map(app => <option key={app.id} value={app.id}>{app.name}</option>)}
                          </FormControl>
                          </Col>
                          { this.state.loading.cfApps &&
                            <Col md={1}>
                              <FaCircleONotch className='spinnerIcon'/>
                            </Col>
                          }
                          <Col md={4}>
                            <Button bsStyle="primary" className='button hidden' onClick={this.fetchCfApps.bind(this)}>Refresh</Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup controlId="mgmtArtifacts-cfRoutes">
                        <Row>
                          <Col md={8}>
                            <ControlLabel>App Route</ControlLabel>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={8}>
                            <FormControl componentClass="select" disabled={!this.state.selectedCfApp} value={this.state.selectedCfRoute} onChange={this.handleChange('selectedCfRoute').bind(this)}>
                              <option value="">{!this.state.selectedCfApp ? 'Select an application to enable' : 'Select a route'}</option>
                              {this.state.cfRoutes && this.state.cfRoutes.map(route => <option key={route.id} value={route.id}>{route.name}</option>)}
                            </FormControl>
                          </Col>
                          { this.state.loading.cfRoutes &&
                            <Col md={1}>
                              <FaCircleONotch className='spinnerIcon'/>
                            </Col>
                          }
                          <Col md={4}>
                            <Button bsStyle="primary" className='button hidden' onClick={this.fetchCfRoutes.bind(this)}>Refresh</Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Row>
                  </div>
                }
              </Col>

              <Col md={5} mdOffset={2}>
                <Row>
                  <h2>API Connect</h2>
                </Row>
                <Row>
                  {this.props.isAPICLoggedIn ? <p>Logged in as {this.props.mgmtConfig.username}</p> : <p>Please log in to API Connect to continue</p>
                  }
                </Row>
                <br />
                {this.props.isAPICLoggedIn &&
                  <div>
                    <Row>
                      <FormGroup controlId="mgmtArtifacts-providers">
                        <Row>
                          <Col md={8}>
                            <ControlLabel>Provider Organization</ControlLabel>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={8}>
                            <FormControl componentClass="select" value={this.state.selectedProviderOrg} onChange={this.handleChange('selectedProviderOrg').bind(this)}>
                              <option value="">Select a provider organization</option>
                              {this.state.providerOrgs && this.state.providerOrgs.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                            </FormControl>
                          </Col>
                          { this.state.loading.apicOrgs &&
                            <Col md={1}>
                              <FaCircleONotch className='spinnerIcon'/>
                            </Col>
                          }
                          <Col md={4}>
                            <Button bsStyle="primary" className='button hidden' onClick={this.fetchApicOrgs.bind(this)}>Refresh</Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup controlId="mgmtArtifacts-catalogs">
                        <Row>
                          <Col md={8}>
                            <ControlLabel>Catalog</ControlLabel>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={8}>
                            <FormControl componentClass="select" disabled={!this.state.selectedProviderOrg} value={this.state.selectedCatalog} onChange={this.handleChange('selectedCatalog').bind(this)}>
                              <option value="">{!this.state.selectedProviderOrg ? 'Select a provider org to enable' : 'Select a catalog'}</option>
                              {this.state.catalogs && this.state.catalogs.map(catalog => <option key={catalog.id} value={catalog.id}>{catalog.name}</option>)}
                            </FormControl>
                          </Col>
                          { this.state.loading.apicCatalogs &&
                            <Col md={1}>
                              <FaCircleONotch className='spinnerIcon'/>
                            </Col>
                          }
                          <Col md={4}>
                            <Button bsStyle="primary" className='button hidden' onClick={this.fetchApicCatalogs.bind(this)}>Refresh</Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup controlId="mgmtArtifacts-apis">
                        <Row>
                          <Col md={8}>
                            <ControlLabel>API</ControlLabel>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={8}>
                            <FormControl componentClass="select" disabled={!this.state.selectedProviderOrg || !this.state.selectedCatalog} value={this.state.selectedApi} onChange={this.handleChange('selectedApi').bind(this)}>
                              <option value="">{(!this.state.selectedProviderOrg || !this.state.selectedCatalog) ? 'Select a catalog to enable' : 'Select an API'}</option>
                              {this.state.apis && this.state.apis.map(api => <option key={api.id} value={api.targetUrl}>{api.apiName}</option>)}
                            </FormControl>
                          </Col>
                          { this.state.loading.apicApis &&
                            <Col md={1}>
                              <FaCircleONotch className='spinnerIcon'/>
                            </Col>
                          }
                          <Col md={4}>
                            <Button bsStyle="primary" className='button hidden' onClick={this.fetchApicApis.bind(this)}>Refresh</Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Row>
                  </div>
                }
              </Col>
            </Row>

            {this.props.isAPICLoggedIn && this.props.isCFLoggedIn &&
              <Row>
                <Col md={2} mdOffset={5}>
                  <Button bsStyle="primary" className='button' disabled={!this.state.selectedProviderOrg || !this.state.selectedCatalog || !this.state.selectedApi || !this.state.selectedCfApp || !this.state.selectedCfRoute} onClick={this.handleBind.bind(this)}>Bind!</Button>
                </Col>
                { this.state.loading.bind &&
                  <Col md={1}>
                    <FaCircleONotch className='spinnerIcon'/>
                  </Col>
                }
                { this.state.bindComplete &&
                  <Col md={1}>
                    <FaCheckSquareO className='completedCheck'/>
                  </Col>
                }
              </Row>
            }
          </form>
        </Grid>
      </div>
    );
  }
}

export default ContentWrapper;
