import React from 'react';

import './NotFoundPage.css';

class notFoundPage extends React.Component {
  render() {
    const { errorText, errorCaption } = this.props;
    return (
      <div id="notFoundPage">
        <h2 className="errorCaption">{errorCaption}</h2>
        <div className="errorText">{errorText}</div>
      </div>
    );
  }
}


export default notFoundPage;
