import React, { Component } from 'react';
import NavWrapper from './components/NavWrapper';
import HeaderWrapper from './components/HeaderWrapper';
import ContentWrapper from './components/ContentWrapper';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mgmtConfig: {},
      cfConfig: {},
      isAPICLoggedIn: false,
      isCFLoggedIn: false,
    };
    this.fetchConfigs();
  }

  fetchConfigs() {
    fetch(`/mgmt/config`)
      .then(result => result.json())
      .then(config => {
        let obj = {
          mgmtConfig: config,
          isAPICLoggedIn: !!config.managementServer && !!config.username && !!config.password
        };
        this.setState({
          mgmtConfig: config,
          isAPICLoggedIn: !!config.managementServer && !!config.username && !!config.password
        });
      });
    fetch(`/cf/config`)
      .then(result => result.json())
      .then(config => {
        let cfConfig = Object.assign({}, this.state.cfConfig, config);
        this.setState({
          cfConfig: cfConfig,
          isCFLoggedIn: !!cfConfig.server && !!cfConfig.token,
        });
      });
  }

  saveMgmtConfig(config) {
    this.setState({
      mgmtConfig: config,
      isAPICLoggedIn: !!config.managementServer && !!config.username && !!config.password,
    });
  }

  saveCFConfig(config) {
    this.setState({
      cfConfig: Object.assign({}, config),
      isCFLoggedIn: config.server && config.token,
    });
  }

  setAPICLoggedIn() {
    let loggedIn = !!this.state.mgmtConfig.managementServer && !!this.state.mgmtConfig.username && !!this.state.mgmtConfig.password;
    this.setState({
      isAPICLoggedIn: loggedIn,
    });
  }

  setCFLoggedIn() {
    let loggedIn = !!this.state.cfConfig.server && !!this.state.cfConfig.token
    this.setState({
      isCFLoggedIn: loggedIn,
    });
  }

  render() {
    return (
      <div className="App">
        <NavWrapper mgmtConfig={this.state.mgmtConfig} saveMgmtConfig={this.saveMgmtConfig.bind(this)} isAPICLoggedIn={this.state.isAPICLoggedIn} cfConfig={this.state.cfConfig} saveCFConfig={this.saveCFConfig.bind(this)} isCFLoggedIn={this.state.isCFLoggedIn}/>
        <HeaderWrapper />
        <ContentWrapper mgmtConfig={this.state.mgmtConfig} isAPICLoggedIn={this.state.isAPICLoggedIn} cfConfig={this.state.cfConfig} isCFLoggedIn={this.state.isCFLoggedIn}/>
      </div>
    );
  }
}

export default App;
