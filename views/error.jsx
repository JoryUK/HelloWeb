var React = require('react');

class ErrorMessage extends React.Component {
  render() {
    return <div>Error: {this.props.message}</div>;
  }
}

module.exports = ErrorMessage;
