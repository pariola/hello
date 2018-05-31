"use strict";

// ? Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../sw.js", { scope: "./" })
    .then(reg => {
      console.log("[SW] registered");
    })
    .catch(e => {
      console.log("Service worker failed to register", e);
    });
}

const { Component, h, render } = window.preact;

class Chat extends Component {
  componentWillMount() {
    const self = this;

    this.state = {
      image: self.getRandomImage(),
      sessionId: self.getRandomId(),
      messages: [
        {
          type: "reply",
          text: "Hi there,<br>You can get started by sending 'Hi'"
        }
      ]
    };

    // Listen for Enter/Return key
    $(window).on("keydown", function(e) {
      if (e.which == 13) {
        self.sendMessage();
        return false;
      }
    });
  }

  getRandomImage() {
    const images = [
      {
        artist: "Marc David Spengler",
        artistLink:
          "https://wepresent.wetransfer.com/story/marc-david-spengler/",
        imageLink: "https://backgrounds.wetransfer.net/marspe4_1680x1050.jpg"
      },
      {
        artist: "Suzanne Saroff",
        artistLink:
          "https://wepresent.wetransfer.com/story/suzanne-saroff-perspective",
        imageLink: "https://backgrounds.wetransfer.net/suzsar3_1680x1050.jpg"
      },
      {
        artist: "Karabo Poppy",
        artistLink: "https://wepresent.wetransfer.com/story/karabo-poppy",
        imageLink: "https://backgrounds.wetransfer.net/karpop3_1680x1050.jpg"
      },
      {
        artist: "Till Nowak",
        artistLink:
          "https://wepresent.wetransfer.com/story/till-nowak-black-panther",
        imageLink:
          "https://backgrounds.wetransfer.net/tillnowak4gl_1680x1050.jpg"
      }
    ];

    let no = this.getRandom(images.length);
    return images[no];
  }

  getRandom(limit) {
    return Math.floor(Math.random() * Math.floor(limit));
  }

  getRandomId() {
    // ? Use a 10 integer ID
    var id = "";
    for (var i = 1; i <= 10; i++) {
      id += this.getRandom(9);
    }
    return id;
  }

  scrollToLast() {
    $(".messages").animate(
      { scrollTop: $(".messages")[0].scrollHeight },
      "fast"
    );
  }

  sendMessage() {
    const text = $("#message").val();
    const self = this;
    if (text) {
      this.scrollToLast();
      // Add message
      this.setState({
        messages: this.state.messages.concat({
          type: "sent",
          text: $("#message").val()
        })
      });
      // Reset input
      $("#message").val("");
      // SEND
      axios
        .post("https://hello-me.herokuapp.com/chat", {
          sessionId: self.state.sessionId,
          query: text
        })
        .then(function(response) {
          self.setState({
            messages: self.state.messages.concat(
              response.data.message.map(m => {
                return {
                  type: "reply",
                  text: m.text.text[0]
                };
              })
            )
          });
          self.scrollToLast();
        })
        .catch(function(error) {
          self.setState({
            messages: self.state.messages
              .concat({
                type: "reply",
                text: "Ughh! 😢 THE CLOUD IS DOWN"
              })
              .concat({
                type: "reply",
                text: "Try again later"
              })
          });
          self.scrollToLast();
        });
    }
  }

  render(props, state) {
    const msg = state.messages.map(message => {
      return h(
        "li",
        { class: message.type },
        h("p", { dangerouslySetInnerHTML: { __html: message.text } })
      );
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
            { class: "credit" },
            "Image by ",
            h(
              "a",
              {
                href: state.image.artistLink
              },
              state.image.artist
            )
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
            src: state.image.imageLink
          })
        )
      )
    );
  }
}

render(h(Chat), document.body);
