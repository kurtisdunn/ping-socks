
import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import validate from '../../utils/validator/field';

const $ = window.$;

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

  }

  handleChange(event) {
    const that = this;
    validate(event.target, function (field, errors) {
      that.setState({
        errors: errors
      });
    });
  }

  handleBlur(event) {
    const that = this;
    validate(event.target, function (field, errors) {
      that.setState({
        errors: errors
      });
    });
  }

  componentWillReceiveProps(props) {
    if(props.errors){
      if (props.errors.length) {
        this.setState({ errors: props.errors });
      }
    }

  }

  render() {
    const hasErrors = this.state.errors && this.state.errors.length;
    return (

      <div className={`${ hasErrors ? 'has-danger' : ''}`}>
        <input data-validators={ this.props.validator ? this.props.validator : '' } type={ this.props.type ? this.props.type : 'text' }  className={`form-control ${this.props.class} ${ hasErrors ? 'form-control-danger' : ''}`} name={ this.props.name ? this.props.name : '' } id={ this.props.id ? this.props.id  : '' } placeholder={ this.props.title ? this.props.title : '' } onChange={ this.handleChange } onClick={this.handleFocus} errors={''} />
      </div>
    );
  }
}
