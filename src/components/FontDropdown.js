import React, { Component } from 'react';

import './FontDropdown.css';

class FontDropdown extends Component {
  state = {
    isOpen: false,
  }

  componentDidMount() {
    window.addEventListener('click', this.onWindowClick)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick)
  }

  onWindowClick = (evt) => {
    if (evt.target === this.dropdownToggle || evt.target.parentElement === this.dropdownToggle) {
      return
    }
    if (evt.target === this.dropdownMenu || evt.target.parentElement === this.dropdownMenu) {
      return
    }

    this.setState({
      isOpen: false,
    })
  }

  toggleDropdown = () => {
    if (!this.state.isOpen && this.props.disabled) return;
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const dropdownOpenClass = this.state.isOpen ? ' FontDropdown-open' : '';
    const disabledClass = this.props.disabled ? ' FontDropdown-disabled' : '';
    return (
      <div className="FontDropdown">
        <div
          ref={(dropdownToggle) => this.dropdownToggle = dropdownToggle}
          className={"FontDropdown-dropdown_selection" + disabledClass}
          onClick={this.toggleDropdown}
        >
          <div
            className="FontDropdown-dropdown_selection_value"
            style={{fontFamily: this.props.currentSelection.value}}
          >
            {this.props.currentSelection.label}
          </div>
          <span className={"FontDropdown-dropdown_selection_arrow" + dropdownOpenClass}></span>
        </div>
        <div
          ref={(dropdownMenu) => this.dropdownMenu = dropdownMenu}
          className={"FontDropdown-dropdown" + dropdownOpenClass}
        >
          {this.props.options.map((option) => {
            return (
              <div
                className="FontDropdown-dropdown_option"
                key={option.value}
                style={{fontFamily: option.value}}
                onClick={() => this.props.onChange(option.value)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default FontDropdown;