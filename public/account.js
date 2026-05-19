/**
 * Customer authentication runtime — vanilla JS, no framework.
 * Reads Shopify config from window.__shopifyConfig (embedded by Layout.astro).
 * Stores the Storefront API customerAccessToken in localStorage.
 *
 * Exposes window.Customer with all auth + profile operations,
 * plus window.__customer with the current customer (null when logged out).
 *
 * Also dispatches "customer:changed" events whenever auth state changes.
 */
(function () {
  "use strict";

  var TOKEN_KEY = "sf_customer_token";
  var TOKEN_EXPIRES_KEY = "sf_customer_token_expires";

  // ---------------------------------------------------------------------------
  // GraphQL constants
  // ---------------------------------------------------------------------------

  var CUSTOMER_FIELDS = [
    "fragment CustomerFields on Customer {",
    "  id",
    "  firstName",
    "  lastName",
    "  email",
    "  phone",
    "  acceptsMarketing",
    "  createdAt",
    "  defaultAddress { id formatted(withName: true, withCompany: true) }",
    "  addresses(first: 20) {",
    "    edges { node {",
    "      id firstName lastName company address1 address2",
    "      city province country zip phone formatted(withName: true, withCompany: true)",
    "    } }",
    "  }",
    "  orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {",
    "    edges { node {",
    "      id orderNumber processedAt financialStatus fulfillmentStatus",
    "      totalPrice { amount currencyCode }",
    "      subtotalPrice { amount currencyCode }",
    "      totalShippingPrice { amount currencyCode }",
    "      totalTax { amount currencyCode }",
    "      statusUrl",
    "      lineItems(first: 50) { edges { node {",
    "        title quantity",
    "        variant { id title image { url altText } price { amount currencyCode } product { handle } }",
    "      } } }",
    "      shippingAddress { formatted(withName: true, withCompany: true) }",
    "    } }",
    "  }",
    "}",
  ].join("\n");

  var TOKEN_CREATE =
    "mutation tokenCreate($input: CustomerAccessTokenCreateInput!) {" +
    "  customerAccessTokenCreate(input: $input) {" +
    "    customerAccessToken { accessToken expiresAt }" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var TOKEN_RENEW =
    "mutation tokenRenew($customerAccessToken: String!) {" +
    "  customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {" +
    "    customerAccessToken { accessToken expiresAt }" +
    "    userErrors { field message }" +
    "  }" +
    "}";

  var TOKEN_DELETE =
    "mutation tokenDelete($customerAccessToken: String!) {" +
    "  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {" +
    "    deletedAccessToken deletedCustomerAccessTokenId" +
    "    userErrors { field message }" +
    "  }" +
    "}";

  var CUSTOMER_CREATE =
    "mutation customerCreate($input: CustomerCreateInput!) {" +
    "  customerCreate(input: $input) {" +
    "    customer { id email }" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var CUSTOMER_QUERY =
    "query customer($customerAccessToken: String!) {" +
    "  customer(customerAccessToken: $customerAccessToken) { ...CustomerFields }" +
    "} " + CUSTOMER_FIELDS;

  var CUSTOMER_UPDATE =
    "mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {" +
    "  customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {" +
    "    customer { id email firstName lastName phone acceptsMarketing }" +
    "    customerAccessToken { accessToken expiresAt }" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var CUSTOMER_RECOVER =
    "mutation customerRecover($email: String!) {" +
    "  customerRecover(email: $email) { customerUserErrors { code field message } }" +
    "}";

  var CUSTOMER_RESET =
    "mutation customerReset($id: ID!, $input: CustomerResetInput!) {" +
    "  customerReset(id: $id, input: $input) {" +
    "    customer { id }" +
    "    customerAccessToken { accessToken expiresAt }" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var CUSTOMER_RESET_BY_URL =
    "mutation customerResetByUrl($password: String!, $resetUrl: URL!) {" +
    "  customerResetByUrl(password: $password, resetUrl: $resetUrl) {" +
    "    customer { id }" +
    "    customerAccessToken { accessToken expiresAt }" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var CUSTOMER_ACTIVATE_BY_URL =
    "mutation customerActivateByUrl($activationUrl: URL!, $password: String!) {" +
    "  customerActivateByUrl(activationUrl: $activationUrl, password: $password) {" +
    "    customer { id }" +
    "    customerAccessToken { accessToken expiresAt }" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var ADDRESS_CREATE =
    "mutation addrCreate($customerAccessToken: String!, $address: MailingAddressInput!) {" +
    "  customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {" +
    "    customerAddress { id }" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var ADDRESS_UPDATE =
    "mutation addrUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {" +
    "  customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {" +
    "    customerAddress { id }" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var ADDRESS_DELETE =
    "mutation addrDelete($customerAccessToken: String!, $id: ID!) {" +
    "  customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {" +
    "    deletedCustomerAddressId" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var ADDRESS_DEFAULT =
    "mutation addrDefault($customerAccessToken: String!, $addressId: ID!) {" +
    "  customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {" +
    "    customer { id defaultAddress { id } }" +
    "    customerUserErrors { code field message }" +
    "  }" +
    "}";

  var CART_BUYER_IDENTITY =
    "mutation cartBI($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {" +
    "  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {" +
    "    cart { id totalQuantity }" +
    "    userErrors { field message }" +
    "  }" +
    "}";

  // ---------------------------------------------------------------------------
  // Fetch helper
  // ---------------------------------------------------------------------------

  function gql(query, variables) {
    var cfg = window.__shopifyConfig;
    if (!cfg) return Promise.reject(new Error("Missing __shopifyConfig"));
    var url = "https://" + cfg.store + "/api/" + cfg.version + "/graphql.json";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": cfg.token,
      },
      body: JSON.stringify({ query: query, variables: variables }),
    }).then(function (r) { return r.json(); });
  }

  function joinErrors(arr) {
    return (arr || []).map(function (e) { return e.message; }).join("; ");
  }

  // ---------------------------------------------------------------------------
  // Token storage
  // ---------------------------------------------------------------------------

  function getToken() {
    var t = localStorage.getItem(TOKEN_KEY);
    var exp = localStorage.getItem(TOKEN_EXPIRES_KEY);
    if (!t) return null;
    if (exp && new Date(exp).getTime() < Date.now()) {
      // expired — clear
      clearToken();
      return null;
    }
    return t;
  }

  function setToken(accessToken, expiresAt) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (expiresAt) localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_KEY);
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  window.__customer = null;

  function setCustomer(customer) {
    window.__customer = customer;
    document.dispatchEvent(new CustomEvent("customer:changed", { detail: customer }));
  }

  function flattenAddresses(c) {
    if (!c || !c.addresses) return c;
    c.addresses = (c.addresses.edges || []).map(function (e) { return e.node; });
    return c;
  }

  function flattenOrders(c) {
    if (!c || !c.orders) return c;
    c.orders = (c.orders.edges || []).map(function (e) {
      var n = e.node;
      n.lineItems = (n.lineItems && n.lineItems.edges || []).map(function (li) { return li.node; });
      return n;
    });
    return c;
  }

  // ---------------------------------------------------------------------------
  // Cart-customer association
  // ---------------------------------------------------------------------------

  function linkCartToCustomer(token) {
    if (!window.Cart) return Promise.resolve();
    var cartId = localStorage.getItem("sf_cart_id");
    if (!cartId) return Promise.resolve();
    return gql(CART_BUYER_IDENTITY, {
      cartId: cartId,
      buyerIdentity: { customerAccessToken: token, countryCode: "CY" },
    }).then(function () {
      // Refresh cart state in the open page
      if (window.Cart && typeof window.Cart.loadSavedCart === "function") {
        return window.Cart.loadSavedCart();
      }
    }).catch(function (err) {
      console.warn("Cart buyerIdentity update failed (non-fatal):", err);
    });
  }

  function unlinkCartFromCustomer() {
    var cartId = localStorage.getItem("sf_cart_id");
    if (!cartId) return Promise.resolve();
    return gql(CART_BUYER_IDENTITY, {
      cartId: cartId,
      buyerIdentity: { customerAccessToken: null },
    }).catch(function (err) {
      console.warn("Cart buyerIdentity clear failed (non-fatal):", err);
    });
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  window.Customer = {
    isLoggedIn: function () { return !!getToken(); },

    getToken: getToken,

    /** Refresh customer state from Shopify. Resolves with customer or null. */
    refresh: function () {
      var token = getToken();
      if (!token) {
        setCustomer(null);
        return Promise.resolve(null);
      }
      return gql(CUSTOMER_QUERY, { customerAccessToken: token }).then(function (res) {
        if (res.errors) {
          console.error("Customer.refresh transport errors:", res.errors);
          setCustomer(null);
          return null;
        }
        var c = res.data && res.data.customer;
        if (!c) {
          // Token invalidated server-side — clear it.
          clearToken();
          setCustomer(null);
          return null;
        }
        flattenAddresses(c);
        flattenOrders(c);
        setCustomer(c);
        return c;
      });
    },

    login: function (email, password) {
      return gql(TOKEN_CREATE, { input: { email: email, password: password } })
        .then(function (res) {
          var payload = res.data && res.data.customerAccessTokenCreate;
          var ue = payload ? payload.customerUserErrors || [] : [];
          if (ue.length) throw new Error(joinErrors(ue));
          if (!payload || !payload.customerAccessToken) {
            throw new Error("Invalid email or password.");
          }
          setToken(payload.customerAccessToken.accessToken, payload.customerAccessToken.expiresAt);
          return linkCartToCustomer(payload.customerAccessToken.accessToken)
            .then(function () { return window.Customer.refresh(); });
        });
    },

    register: function (input) {
      // input = { firstName, lastName, email, password, phone?, acceptsMarketing? }
      return gql(CUSTOMER_CREATE, { input: input }).then(function (res) {
        var payload = res.data && res.data.customerCreate;
        var ue = payload ? payload.customerUserErrors || [] : [];
        if (ue.length) throw new Error(joinErrors(ue));
        if (!payload || !payload.customer) throw new Error("Account creation failed.");
        // Auto-login
        return window.Customer.login(input.email, input.password);
      });
    },

    logout: function () {
      var token = getToken();
      var cleanup = function () {
        clearToken();
        setCustomer(null);
        return unlinkCartFromCustomer();
      };
      if (!token) return cleanup();
      return gql(TOKEN_DELETE, { customerAccessToken: token })
        .then(cleanup)
        .catch(cleanup);
    },

    recover: function (email) {
      return gql(CUSTOMER_RECOVER, { email: email }).then(function (res) {
        var payload = res.data && res.data.customerRecover;
        var ue = payload ? payload.customerUserErrors || [] : [];
        if (ue.length) throw new Error(joinErrors(ue));
        return true;
      });
    },

    resetByUrl: function (resetUrl, password) {
      return gql(CUSTOMER_RESET_BY_URL, { resetUrl: resetUrl, password: password })
        .then(function (res) {
          var payload = res.data && res.data.customerResetByUrl;
          var ue = payload ? payload.customerUserErrors || [] : [];
          if (ue.length) throw new Error(joinErrors(ue));
          if (!payload || !payload.customerAccessToken) {
            throw new Error("Password reset failed.");
          }
          setToken(payload.customerAccessToken.accessToken, payload.customerAccessToken.expiresAt);
          return linkCartToCustomer(payload.customerAccessToken.accessToken)
            .then(function () { return window.Customer.refresh(); });
        });
    },

    activateByUrl: function (activationUrl, password) {
      return gql(CUSTOMER_ACTIVATE_BY_URL, { activationUrl: activationUrl, password: password })
        .then(function (res) {
          var payload = res.data && res.data.customerActivateByUrl;
          var ue = payload ? payload.customerUserErrors || [] : [];
          if (ue.length) throw new Error(joinErrors(ue));
          if (!payload || !payload.customerAccessToken) {
            throw new Error("Account activation failed.");
          }
          setToken(payload.customerAccessToken.accessToken, payload.customerAccessToken.expiresAt);
          return linkCartToCustomer(payload.customerAccessToken.accessToken)
            .then(function () { return window.Customer.refresh(); });
        });
    },

    updateProfile: function (input) {
      // input subset of CustomerUpdateInput: firstName, lastName, email, phone, acceptsMarketing, password
      var token = getToken();
      if (!token) return Promise.reject(new Error("Not logged in"));
      return gql(CUSTOMER_UPDATE, { customerAccessToken: token, customer: input })
        .then(function (res) {
          var payload = res.data && res.data.customerUpdate;
          var ue = payload ? payload.customerUserErrors || [] : [];
          if (ue.length) throw new Error(joinErrors(ue));
          if (payload && payload.customerAccessToken) {
            setToken(payload.customerAccessToken.accessToken, payload.customerAccessToken.expiresAt);
          }
          return window.Customer.refresh();
        });
    },

    addAddress: function (address) {
      var token = getToken();
      if (!token) return Promise.reject(new Error("Not logged in"));
      return gql(ADDRESS_CREATE, { customerAccessToken: token, address: address })
        .then(function (res) {
          var payload = res.data && res.data.customerAddressCreate;
          var ue = payload ? payload.customerUserErrors || [] : [];
          if (ue.length) throw new Error(joinErrors(ue));
          return window.Customer.refresh();
        });
    },

    updateAddress: function (id, address) {
      var token = getToken();
      if (!token) return Promise.reject(new Error("Not logged in"));
      return gql(ADDRESS_UPDATE, { customerAccessToken: token, id: id, address: address })
        .then(function (res) {
          var payload = res.data && res.data.customerAddressUpdate;
          var ue = payload ? payload.customerUserErrors || [] : [];
          if (ue.length) throw new Error(joinErrors(ue));
          return window.Customer.refresh();
        });
    },

    deleteAddress: function (id) {
      var token = getToken();
      if (!token) return Promise.reject(new Error("Not logged in"));
      return gql(ADDRESS_DELETE, { customerAccessToken: token, id: id })
        .then(function (res) {
          var payload = res.data && res.data.customerAddressDelete;
          var ue = payload ? payload.customerUserErrors || [] : [];
          if (ue.length) throw new Error(joinErrors(ue));
          return window.Customer.refresh();
        });
    },

    setDefaultAddress: function (addressId) {
      var token = getToken();
      if (!token) return Promise.reject(new Error("Not logged in"));
      return gql(ADDRESS_DEFAULT, { customerAccessToken: token, addressId: addressId })
        .then(function (res) {
          var payload = res.data && res.data.customerDefaultAddressUpdate;
          var ue = payload ? payload.customerUserErrors || [] : [];
          if (ue.length) throw new Error(joinErrors(ue));
          return window.Customer.refresh();
        });
    },

    /** Optional: extend the lifetime of the current token. */
    renewToken: function () {
      var token = getToken();
      if (!token) return Promise.resolve(null);
      return gql(TOKEN_RENEW, { customerAccessToken: token }).then(function (res) {
        var payload = res.data && res.data.customerAccessTokenRenew;
        if (payload && payload.customerAccessToken) {
          setToken(payload.customerAccessToken.accessToken, payload.customerAccessToken.expiresAt);
        }
      });
    },
  };

  // Auto-refresh on script load if a token exists.
  Customer.refresh();
})();
