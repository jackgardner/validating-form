import React, { PropTypes, Component } from 'react';

export const ModelServiceDecorator = function (options) {
  options = options || {};

  return (ChildComponent) => {
    return class ModelServiceDecorator extends Component {
      constructor() {
        super();
        this.state = {
          fieldKey: ''
        };

        this.modelServiceHook = this.modelServiceHook.bind(this);
      }
      modelServiceHook(event) {
        const fieldKey = event.target.id || event.target.name;
        const fieldValue = event.target.value;
        this.props.modelService.setModelField(fieldKey, fieldValue);
        this.setState({ changed: true });
      }

      render () {
        return React.createElement(ChildComponent, {...this.props, modelServiceHook: this.modelServiceHook });
      }
    }
  }
};
