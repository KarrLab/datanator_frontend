import { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class ScrollToTop extends Component {
  static propTypes = {
    location: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    if (this.props.location.hash) {
      window.addEventListener("load", () => {
        window.scrollBy({ top: -52, behavior: "smooth" });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
