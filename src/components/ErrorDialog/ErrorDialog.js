import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export class ErrorDialog extends Component {
  constructor() {
    super();

    this.state = {
      message: null,
      open: false
    };

    this.close = this.close.bind(this);
  }

  open(message) {
    this.setState({
      message: message,
      open: true
    });
  }

  close() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div className="error-dialog">
        <Dialog
          open={this.state.open}
          aria-labelledby="error-dialog-title"
          aria-describedby="error-dialog-description"
        >
          <DialogTitle id="error-dialog-title">Server error</DialogTitle>
          <DialogContent>
            <DialogContentText id="error-dialog-description">
              {this.state.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary" autoFocus>
              Dismiss
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export const errorDialogRef = React.createRef();
export const errorDialog = <ErrorDialog ref={errorDialogRef} />;
