import React from 'react';
import { FormFeedback, FormGroup } from 'reactstrap';
export default class ValidatingFormGroup extends React.Component {
  static defaultProps = {
    validations: []
  };

  render () {
    const { displayFeedback, onChange, label, validations, className, controlId } = this.props;
    const controlIsInvalid = validations.find((validation) => validation.name === controlId);
    let feedback = null;

    const inputProps = {
      id: controlId,
      className,
      onChange
    };

    if (controlIsInvalid) {
      inputProps.validationState = 'error';
      if (!displayFeedback) {
        feedback = <FormFeedback>{controlIsInvalid.message}</FormFeedback>
      }
    }
    const children = React.Children.map(this.props.children, (child) => {
      return (<div>
          {React.cloneElement(child, { id: controlId, color: 'danger' })}
          {feedback}
        </div>);
    });

    return (
      <FormGroup {...inputProps} >
        {label}
        {children}
      </FormGroup>
    )
  }
}
