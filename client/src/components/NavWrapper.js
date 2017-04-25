import React, { Component } from 'react';
import { Navbar, Nav, NavItem, MenuItem, NavDropdown, Modal, Button, FormGroup, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap';

class NavWrapper extends Component {

  constructor (props) {
    super(props);
    this.state = {
        showAPICLoginModal: false,
        showCFLoginModal: false,
        mgmtConfig: Object.assign({}, this.props.mgmtConfig),
        cfConfig: Object.assign({}, this.props.cfConfig),
    };
  }

  openAPICLoginModal() {
    this.setState({
      showAPICLoginModal: true,
    });
  }

  closeAPICLoginModal() {
    this.setState({
      showAPICLoginModal: false,
    });
  }

  openCFLoginModal() {
    this.setState({
      showCFLoginModal: true,
    });
  }

  closeCFLoginModal() {
    this.setState({
      showCFLoginModal: false,
    });
  }

  handleChange(field) {
    return evt => {

      let value = evt.target.value;

      if (field.indexOf('cf-') >= 0) {
        field = field.replace('cf-', '');
        this.setState({
          cfConfig: Object.assign(this.state.cfConfig, {
            [field]: value
          }),
        });
      } else {
        field = field.replace('apic-', '');
        this.setState({
          mgmtConfig: Object.assign(this.state.mgmtConfig, {
            [field]: value
          }),
        });
      }


    };
  }

  handleAPICLoginSubmit() {
    this.props.saveMgmtConfig(this.state.mgmtConfig);
    this.closeAPICLoginModal();
  }

  handleCFLoginSubmit() {
    this.props.saveCFConfig(this.state.cfConfig);
    this.closeCFLoginModal();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
    return (
      <div>
        <Navbar className='globalNav'>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">API Connect</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <NavItem eventKey={1} href="#" onClick={this.openCFLoginModal.bind(this)}>CF Login</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#" onClick={this.openAPICLoginModal.bind(this)}>APIC Login</NavItem>
          </Nav>
        </Navbar>
        <Modal show={this.state.showAPICLoginModal} onHide={this.closeAPICLoginModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>API Connect Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup controlId="mgmtServerLogin">
                <ControlLabel>Management Server</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.mgmtConfig.managementServer}
                  onChange={this.handleChange('apic-managementServer').bind(this)}
                />
                <ControlLabel>Username</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.mgmtConfig.username}
                  onChange={this.handleChange('apic-username').bind(this)}
                />
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  value={this.state.mgmtConfig.password}
                  onChange={this.handleChange('apic-password').bind(this)}
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeAPICLoginModal.bind(this)}>Close</Button>
            <Button onClick={this.handleAPICLoginSubmit.bind(this)}>Save</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showCFLoginModal} onHide={this.closeCFLoginModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>CF Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup controlId="cfLogin">
                <ControlLabel>CF Token</ControlLabel>
                <FormControl
                  type="textarea"
                  value={this.state.cfConfig.token}
                  onChange={this.handleChange('cf-token').bind(this)}
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeCFLoginModal.bind(this)}>Close</Button>
            <Button onClick={this.handleCFLoginSubmit.bind(this)}>Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default NavWrapper;
