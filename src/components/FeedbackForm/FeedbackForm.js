import React, { Component } from "react";
import "./FeedbackForm.scss";

export default class FeedbackForm extends Component {
  render() {
    return (
      <bruit-io
        brt-config={JSON.stringify({
          apiKey: "e9e463f9-8444-48d1-acad-a22803854221",
          labels: {
            title: "Send us feedback",
            button: "Send"
          },
          form: [
            {
              label: "Comments",
              type: "textarea",
              id: "title",
              required: true
            },
            {
              label: "Your name",
              type: "text"
            },
            {
              label: "Email",
              type: "text"
            },
            {
              id: "agreement",
              type: "checkbox",
              label:
                "I agree to send a screenshot and technical information about my browser",
              value: false,
              required: true
            }
          ],
          colors: {
            header: "#2196f3",
            body: "#eee",
            background: "#444444ee",
            errors: "#f44336",
            focus: "#2196f3"
          },
          closeModalOnSubmit: true
        })}
      >
        <div className="feedback-form-component">Send feedback</div>
      </bruit-io>
    );
  }
}
