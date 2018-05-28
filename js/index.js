"use strict";

const { Component, h, render } = window.preact;

class Chat extends Component {
  componentWillMount() {
    this.state = {
      messages: [{ type: "reply", text: "Hi there, how can i help you?" }]
    };

    const self = this;
    // Listen for Enter/Return key
    $(window).on("keydown", function(e) {
      if (e.which == 13) {
        self.sendMessage();
        return false;
      }
    });
  }

  sendMessage() {
    const text = $("#message").val();
    if (text) {
      // SEND
      $(".messages").animate(
        { scrollTop: $(".messages")[0].scrollHeight },
        "fast"
      );
      this.setState({
        messages: this.state.messages
          .concat({
            type: "sent",
            text: $("#message").val()
          })
      });
      $("#message").val("");
    }
  }

  render(props, state) {
    const msg = state.messages.map(message => {
      return h("li", { class: message.type }, h("p", null, message.text));
    });
    return h(
      "div",
      null,
      h(
        "div",
        { class: "main" },
        h(
          "div",
          { class: "container" },
          h(
            "div",
            { class: "seven offset-by-two columns" },
            h(
              "div",
              { class: "content" },
              h("div", { class: "messages" }, h("ul", { id: "msg_list" }, msg)),
              h(
                "div",
                { class: "message-input" },
                h(
                  "div",
                  { class: "wrap" },
                  h("input", {
                    id: "message",
                    type: "text",
                    placeholder: "Write your message..."
                  }),
                  h(
                    "button",
                    { class: "submit", onclick: this.sendMessage.bind(this) },
                    "SEND"
                  )
                )
              )
            )
          )
        ),
        h(
          "div",
          { style: "padding: 8px" },
          h(
            "p",
            { class: "dev" },
            "Developed with ❤ by ",
            h("a", { href: "https://blessing.pario.la" }, "Blessing Pariola")
          ),
          h(
            "p",
            { class: "credit" },
            "Image by ",
            h("a", { href: "https://wepresent.wetransfer.com/story/championing-diversity-leo-adef/" }, "Leo Adef")
          )
        )
      ),
      h(
        "div",
        { class: "cover" },
        h(
          "div",
          { class: "item" },
          h("img", {
            src:
              "https://images.ctfassets.net/5jh3ceokw2vz/mpC28mlVtu42EYgQ2aY82/fbb70a01de05f518c2b4a37d82741ca6/WT_LEO_ADEF5.jpg?w=1600"
          })
        )
      )
    );
  }
}

render(h(Chat), document.body);
