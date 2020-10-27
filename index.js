var LINK_ONE = { "name" : "Google", "url" : "https://cloud.google.com/" };
var LINK_TWO = { "name" : "Cloudflare", "url" : "https://cloudflare.com" };
var LINK_THREE = { "name" : "Amazon", "url" : "https://aws.amazon.com/" };
var LINK_FOUR = { "name" : "Microsoft", "url" : "https://azure.microsoft.com/en-us/services/cdn/" };
var LINK_FIVE = { "name" : "Akamai", "url" : "https://www.akamai.com/" };
var LINKS = [ LINK_ONE, LINK_TWO, LINK_THREE, LINK_FOUR, LINK_FIVE ]; 
var SOCIALS = [ 
  { "name": "Linkedin", "url" : "https://linkedin.com/in/mahmud-ahmed", "logo": "https://simpleicons.org/icons/linkedin.svg"}, 
  { "name" : "Github", "url" : "https://github.com/mahmud-ahmed", "logo" : "https://simpleicons.org/icons/github.svg"},
  { "name" : "Medium", "url" : "https://medium.com/@moe.purplefox", "logo" : "https://simpleicons.org/icons/medium.svg"}
]

// Eventlistener
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});


// Appends the Links to DIV#links tag 
class ElementHandler {
  async element(element) {
    for ( let link of LINKS) {
      element.append(`<a href="${link.url}">${link.name}</a>`, { html: true })
    }
  }
}

// Removes the "style" attribute from the given element. 
class DisplayHandler {
  constructor(ele) { // ele ==> the tag we are updating
    this.ele = ele;
  }

  async element(element) {
    element.removeAttribute("style");
    if (this.ele === "social") { // are we updateing social links? 
      for ( let social of SOCIALS) {
        element.append(`<a href="${social.url}"><svg><image href=${social.logo} height="50" width="50"/></svg></a>`, { html: true })
      }
    } else if (this.ele === "background") {
      element.setAttribute("style", "background-color: #2CA3DC")
    }
  }
}


//Rewrites "src"/text for elements
class AttributeRewriter {
  constructor(attributeName, value) {
    this.attributeName = attributeName
    this.value = attributeName === "src" ? "https://i.pinimg.com/564x/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg" : value;
  }
  element(element) {
    if (this.attributeName === "src") {
      element.setAttribute(
        this.attributeName,
        this.value,
      )
    } else {
      element.setInnerContent(
        this.value
      )
    }
  }
}


// handles the main logic, checks weather the url is targeting an API endpoint or not. Handles accordingly.   
async function handleRequest(request) {
  const path = new URL(request.url).pathname;
  if (path === "/links") {
    return new Response(JSON.stringify(LINKS), {
      headers: { "content-type": "application/json" }
    })
  } else {
    const res = await fetch("https://static-links-page.signalnerve.workers.dev");
    const rewriter = new HTMLRewriter()
      .on("#links", new ElementHandler())
      .on("#profile", new DisplayHandler())
      .on("#name", new AttributeRewriter("value", "Mahmud Ahmed"))
      .on("#avatar", new AttributeRewriter("src"))
      .on("#social", new DisplayHandler("social"))
      .on("body", new DisplayHandler("background"))
      .on("title", new AttributeRewriter("value", "Mahmud Ahmed"));

    return rewriter.transform(res);
  };
};

 