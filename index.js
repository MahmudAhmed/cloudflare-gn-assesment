addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});

var LINK_ONE = { "name" : "Google", "url" : "https://cloud.google.com/" };
var LINK_TWO = { "name" : "Cloudflare", "url" : "https://cloudflare.com" };
var LINK_THREE = { "name" : "Amazon", "url" : "https://aws.amazon.com/" };

var LINKS = [ LINK_ONE, LINK_TWO, LINK_THREE ]; 

class ElementHandler {
  async element(element) {
    for ( let link of LINKS) {
      element.append(`<a href="${link.url}">${link.name}</a>`, { html: true })
    }
  }
}

class ProfileHandler {
  async element(element) {
    element.removeAttribute("style");
  }
}

class AttributeRewriter {
  constructor(attributeName) {
    this.attributeName = attributeName
    this.value = attributeName === "src" ? "https://media-exp1.licdn.com/dms/image/C4D35AQGmLYdaPBUNvw/profile-framedphoto-shrink_400_400/0?e=1603137600&v=beta&t=MDYky6qyGQ1KsylwGErNgP9FRKxObb8LsMGbRQ5B3eQ" : "Mahmud"
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
      .on("#profile", new ProfileHandler())
      .on("#name", new AttributeRewriter("value"))
      .on("#avatar", new AttributeRewriter("src"))
    return rewriter.transform(res)   
  };
};

