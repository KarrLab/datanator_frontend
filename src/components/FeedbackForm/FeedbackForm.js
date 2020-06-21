import React, { Component } from "react";
import "./FeedbackForm.scss";

const API_KEY = process.env.REACT_APP_BRUIT_API_KEY;

export default class FeedbackForm extends Component {
  render() {
    return (
      <bruit-io
        brt-config={JSON.stringify({
          apiKey: API_KEY,
          labels: {
            title: "Send us feedback",
            button: "Send",
          },
          form: [
            {
              label: "Comments",
              type: "textarea",
              id: "title",
              required: true,
            },
            {
              label: "Your name",
              type: "text",
            },
            {
              label: "Email",
              type: "text",
            },
            {
              id: "agreement",
              type: "checkbox",
              label:
                "I agree to send a screenshot and technical information about my browser",
              value: false,
              required: true,
            },
          ],
          colors: {
            header: "#2196f3",
            body: "#eee",
            background: "#444444ee",
            errors: "#f44336",
            focus: "#2196f3",
          },
          closeModalOnSubmit: false,
        })}
      >
        <div className="feedback-form-component">Send feedback</div>
      </bruit-io>
    );
  }
}
