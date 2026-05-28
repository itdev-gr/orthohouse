/**
 * Cart management — vanilla JS, no framework.
 * Reads Shopify config from window.__shopifyConfig (embedded by Layout.astro).
 * Persists cart ID in localStorage. Dispatches "cart:updated" events.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "sf_cart_id";

  // ---------------------------------------------------------------------------
  // GraphQL
  // ---------------------------------------------------------------------------

  var CART_FIELDS = [
    "fragment CartFields on Cart {",
    "  id",
    "  checkoutUrl",
    "  totalQuantity",
    "  cost { subtotalAmount { amount currencyCode } }",
    "  lines(first: 100) {",
    "    edges {",
    "      node {",
    "        id",
    "        quantity",
    "        merchandise {",
    "          ... on ProductVariant {",
    "            id",
    "            title",
    "            price { amount currencyCode }",
    "            image { url altText }",
    "            product { title handle }",
    "          }",
    "        }",
    "      }",
    "    }",
    "  }",
    "}",
  ].join("\n");

  var CART_CREATE =
    "mutation cartCreate($input: CartInput) { cartCreate(input: $input) { cart { ...CartFields } userErrors { field message } } } " +
    CART_FIELDS;

  var CART_QUERY =
    "query cart($id: ID!) { cart(id: $id) { ...CartFields } } " + CART_FIELDS;

  var CART_LINES_ADD =
    "mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } } } " +
    CART_FIELDS;

  var CART_LINES_UPDATE =
    "mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } } } " +
    CART_FIELDS;

  var CART_LINES_REMOVE =
    "mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message } } } " +
    CART_FIELDS;

  // ---------------------------------------------------------------------------
  // Shopify fetch helper
  // ---------------------------------------------------------------------------

  function getCfg() {
    return window.__shopifyConfig;
  }

  function gql(query, variables) {
    var cfg = getCfg();
    if (!cfg) return Promise.reject(new Error("Missing __shopifyConfig"));
    var url =
      "https://" + cfg.store + "/api/" + cfg.version + "/graphql.json";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": cfg.token,
      },
      body: JSON.stringify({ query: query, variables: variables }),
    }).then(function (r) {
      if (!r.ok) throw new Error("Shopify HTTP " + r.status);
      return r.json();
    });
  }

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------

  window.__cart = null;

  function setCart(cart) {
    window.__cart = cart;
    updateCartBadge();
    document.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
  }

  // ---------------------------------------------------------------------------
  // Badge
  // ---------------------------------------------------------------------------

  function updateCartBadge() {
    var badge = document.getElementById("cart-badge");
    if (!badge) return;
    var qty = window.__cart ? window.__cart.totalQuantity : 0;
    badge.textContent = qty;
    badge.style.display = qty > 0 ? "" : "none";
  }

  // ---------------------------------------------------------------------------
  // Core operations
  // ---------------------------------------------------------------------------

  function loadCart(id) {
    return gql(CART_QUERY, { id: id }).then(function (res) {
      if (res.errors) {
        console.error("loadCart errors", res.errors);
        return null;
      }
      return res.data && res.data.cart ? res.data.cart : null;
    });
  }

  function createCart() {
    return gql(CART_CREATE, { input: {} }).then(function (res) {
      if (res.errors) {
        console.error("cartCreate transport errors", res.errors);
        throw new Error(
          res.errors.map(function (e) { return e.message; }).join(", ")
        );
      }
      var payload = res.data && res.data.cartCreate;
      var ue = payload ? payload.userErrors || [] : [];
      if (ue.length) {
        console.error("cartCreate userErrors", ue);
        throw new Error(
          ue.map(function (e) { return e.message; }).join(", ")
        );
      }
      if (!payload || !payload.cart) throw new Error("cartCreate returned null");
      return payload.cart;
    });
  }

  function ensureCartId() {
    var id = localStorage.getItem(STORAGE_KEY);
    if (id) {
      return loadCart(id)
        .then(function (cart) {
          if (cart) {
            setCart(cart);
            return id;
          }
          // Cart not found server-side — purge stale id and create a new cart.
          localStorage.removeItem(STORAGE_KEY);
          return createFresh();
        })
        .catch(function (err) {
          console.warn("loadCart failed, creating fresh cart:", err);
          localStorage.removeItem(STORAGE_KEY);
          return createFresh();
        });
    }
    return createFresh();
  }

  function createFresh() {
    return createCart().then(function (cart) {
      localStorage.setItem(STORAGE_KEY, cart.id);
      setCart(cart);
      return cart.id;
    });
  }

  // ---------------------------------------------------------------------------
  // Public API (attached to window)
  // ---------------------------------------------------------------------------

  window.Cart = {
    addToCart: function (variantId, quantity) {
      quantity = quantity || 1;
      return ensureCartId().then(function (cartId) {
        return gql(CART_LINES_ADD, {
          cartId: cartId,
          lines: [{ merchandiseId: variantId, quantity: quantity }],
        });
      }).then(function (res) {
        if (res.errors) throw new Error(res.errors.map(function (e) { return e.message; }).join(", "));
        var payload = res.data && res.data.cartLinesAdd;
        var ue = payload ? payload.userErrors || [] : [];
        if (ue.length) throw new Error(ue.map(function (e) { return e.message; }).join(", "));
        if (!payload || !payload.cart) throw new Error("cartLinesAdd returned no cart");
        setCart(payload.cart);
        return payload.cart;
      });
    },

    updateLine: function (lineId, quantity) {
      return ensureCartId().then(function (cartId) {
        return gql(CART_LINES_UPDATE, {
          cartId: cartId,
          lines: [{ id: lineId, quantity: quantity }],
        });
      }).then(function (res) {
        if (res.errors) throw new Error(res.errors.map(function (e) { return e.message; }).join(", "));
        var payload = res.data && res.data.cartLinesUpdate;
        if (!payload || !payload.cart) throw new Error("cartLinesUpdate failed");
        setCart(payload.cart);
        return payload.cart;
      });
    },

    removeLines: function (lineIds) {
      return ensureCartId().then(function (cartId) {
        return gql(CART_LINES_REMOVE, {
          cartId: cartId,
          lineIds: lineIds,
        });
      }).then(function (res) {
        if (res.errors) throw new Error(res.errors.map(function (e) { return e.message; }).join(", "));
        var payload = res.data && res.data.cartLinesRemove;
        if (!payload || !payload.cart) throw new Error("cartLinesRemove failed");
        setCart(payload.cart);
        return payload.cart;
      });
    },

    getCheckoutUrl: function () {
      return window.__cart ? window.__cart.checkoutUrl : null;
    },

    loadSavedCart: function () {
      var id = localStorage.getItem(STORAGE_KEY);
      if (!id) {
        setCart(null);
        return Promise.resolve(null);
      }
      return loadCart(id).then(function (cart) {
        if (cart) {
          setCart(cart);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setCart(null);
        }
        return cart;
      }).catch(function (err) {
        console.error("Failed to load saved cart:", err);
        localStorage.removeItem(STORAGE_KEY);
        setCart(null);
        return null;
      });
    },
  };

  // Auto-load saved cart on script load
  Cart.loadSavedCart();
})();
