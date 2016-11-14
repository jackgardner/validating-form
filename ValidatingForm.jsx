import React from 'react';
import { ValidatingFormGroup } from './FormGroup';
import {
  Input,
  Radio,
  Checkbox,
  FormGroup,
  ControlLabel,
  Button
} from 'reactstrap';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import ModelServiceDecorator from './ModelServiceDecorator.js';
import ReactSelect from 'react-select';

const dateFormat = 'Do MMMM YYYY';
const editFormat = 'DD/MM/YYYY';

@ModelServiceDecorator({ validateEmpty: false })
export default class ValidatingForm extends React.Component {

  static defaultProps = {
    validations: [],
    disableValidations: false,
    showLabels: true,
    submitText: 'Submit'
  };

  constructor(props) {
    super(props);

    this.fieldRenderer = this.fieldRenderer.bind(this);
    this.normaliseField = this.normaliseField.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

  onSubmit(event) {
    event.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  selectChange(name, data) {
    const { modelServiceHook } = this.props;

    // Send a synthetic event
    modelServiceHook({
      synthetic: true,
      target: {
        id: name,
        value: data.value
      }
    });
  }
  dateTimeChange(name, value) {
    const { modelServiceHook } = this.props;

    // Send a synthetic event
    modelServiceHook({
      synthetic: true,
      target: {
        id: name,
        value: value
      }
    });
  }

  normaliseField(field) {
    let normalisedField = field;
    if (typeof field === 'string') {
      normalisedField = {
        field: field,
        placeholder: field
      };
    }

    return normalisedField;
  }

  fieldRenderer(fieldToRender, key) {
    const { validations, modelServiceHook, modelService, showLabels } = this.props;
    const field = this.normaliseField(fieldToRender);
    const fieldValue = modelService.getModelField(field.field);
    const schemaDefinition = modelService.schema.getDefinition(field.field);
    let control = null;


    if (schemaDefinition && schemaDefinition.allowedValues) {
      if (field.showAsSelect) {
        // TODO support ReactSelect for long selections
        const options = schemaDefinition.allowedValues.map(field.optionIterator);
        control = <ReactSelect value={fieldValue} options={options}
                               onChange={this.selectChange.bind(this, field.field)} />
      } else {
        control =
          (<FormGroup controlId={field.field}
          >{schemaDefinition.allowedValues.map((value, key) =>
            <Radio onChange={modelServiceHook} name={field.field}
                   checked={fieldValue === value} inline value={value}
                   key={key}>{value}</Radio>)}
          </FormGroup>);
      }
    } else if (field.selectItems) {
      const options = field.selectItems;
      control = <ReactSelect value={fieldValue} options={options}
                             onChange={this.selectChange.bind(this, field.field)} />
    } else if (schemaDefinition && schemaDefinition.type === Date) {
      control =
        <DateTimePicker onChange={this.dateTimeChange.bind(this, field.field)}
                        time={false} format={dateFormat} editFormat={editFormat}
                        value={fieldValue}/>;
    } else if (schemaDefinition && schemaDefinition.type === Boolean) {
      control = <Checkbox bsSize="large" onChange={modelServiceHook} name={field.field} value={fieldValue} />;
    } else {
      control = <Input key={key} onChange={modelServiceHook}
                             placeholder={field.placeholder}
                             value={fieldValue}/>;
    }

    const label = showLabels ?
      <ControlLabel>{field.placeholder}</ControlLabel> : null;

    return (<ValidatingFormGroup key={key} validations={validations}
                                 controlId={field.field} label={label}>
      {control}
    </ValidatingFormGroup>);

  }

  render() {
    const { fields, validations, disableValidations, submitText, hideSubmit, modelServiceHook } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        {fields.map((field, key) => {
          if (field) {
            return this.fieldRenderer(field, key);
          }
        })}
        {this.props.children}

        <Button type="submit"
                disabled={disableValidations && validations.length > 0}>
          {submitText}
        </Button>
      </form>);
  }
}
