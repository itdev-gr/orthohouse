(function () {
  var el = document.getElementById("swr-data");
  if (!el) return;

  var swr;
  try { swr = JSON.parse(el.textContent); } catch { return; }

  var cfg = swr.config;
  var url = "https://" + cfg.store + "/api/" + cfg.version + "/graphql.json";
  var headers = { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": cfg.token };
  var isPaginated = swr.extract.endsWith(".nodes") && swr.query.indexOf("$after") !== -1;

  function resolve(obj, path) {
    return path.split(".").reduce(function (o, k) { return o && o[k]; }, obj);
  }

  function fetchGQL(variables) {
    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query: swr.query, variables: variables }),
    }).then(function (r) { return r.json(); });
  }

  function fetchAll() {
    if (!isPaginated) {
      return fetchGQL(swr.variables).then(function (r) {
        return resolve(r.data, swr.extract);
      });
    }
    // Paginated: collect all nodes across cursor pages
    var nodes = [];
    var basePath = swr.extract.replace(/\.nodes$/, "");
    function page(after) {
      var vars = Object.assign({}, swr.variables, { after: after });
      return fetchGQL(vars).then(function (r) {
        var conn = resolve(r.data, basePath);
        if (conn && conn.nodes) nodes = nodes.concat(conn.nodes);
        if (conn && conn.pageInfo && conn.pageInfo.hasNextPage) {
          return page(conn.pageInfo.endCursor);
        }
        return nodes;
      });
    }
    return page(null);
  }

  function renderCard(p) {
    var img = p.featuredImage
      ? '<img src="' + p.featuredImage.url + '" alt="' + (p.featuredImage.altText || p.title).replace(/"/g, "&quot;") + '">'
      : "";
    var price = parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2);
    var currency = p.priceRange.minVariantPrice.currencyCode;
    return '<a class="card" href="/products/' + p.handle + '">'
      + img
      + '<div class="info"><h2>' + p.title + "</h2>"
      + '<p class="price">' + currency + " " + price + "</p></div></a>";
  }

  function renderDetail(p) {
    var imgs = (p.images && p.images.nodes || []).map(function (img) {
      return '<img src="' + img.url + '" alt="' + (img.altText || p.title).replace(/"/g, "&quot;") + '">';
    }).join("");
    var price = parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2);
    var currency = p.priceRange.minVariantPrice.currencyCode;
    return '<div class="images">' + imgs + "</div>"
      + '<div class="details"><h1>' + p.title + "</h1>"
      + '<p class="price">' + currency + " " + price + "</p>"
      // Strip <script> tags injected by Shopify apps (e.g. MtPopUpList size chart widget)
      + '<div class="description">' + (p.descriptionHtml || "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") + "</div></div>";
  }

  fetchAll()
    .then(function (fresh) {
      if (JSON.stringify(swr.data) === JSON.stringify(fresh)) return;
      var target = document.getElementById("swr-target");
      if (!target) return;
      var type = target.getAttribute("data-swr-type");
      if (type === "detail") {
        target.innerHTML = renderDetail(fresh);
      } else {
        target.innerHTML = (Array.isArray(fresh) ? fresh : []).map(renderCard).join("");
      }
    })
    .catch(function () { /* build-time content stays */ });
})();
