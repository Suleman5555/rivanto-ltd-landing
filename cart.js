/* RIVANTO LTD — basket + checkout (front end only).
 *
 * No server and no payment processor is wired up yet: the basket lives in
 * the visitor's browser (localStorage). Placing an order shows a
 * confirmation and offers to email the order to rivantoltd@gmail.com.
 * No card details are ever collected on this site.
 *
 * Prices include 19% German VAT. Standard delivery is EUR 4.95, free in
 * Germany on orders of EUR 50 or more; express delivery is EUR 9.95.
 * Payment is by bank transfer (Vorkasse) — details are emailed after the
 * order is placed. Keep PRODUCTS in sync with build-products.py.
 */
(function () {
  "use strict";

  var PRODUCTS = {
    "kitchen-storage-jars": { name: "Airtight Kitchen Storage Jar Set \u2014 5 Piece", price: 24.99, img: "/images/kitchen-storage-jars.jpg" },
    "usb-c-fast-charger": { name: "USB-C Fast Charger 20W \u2014 2 Pack", price: 14.99, img: "/images/usb-c-fast-charger.jpg" },
    "stackable-storage-boxes": { name: "Stackable Storage Box Set \u2014 4 \u00d7 32L", price: 29.99, img: "/images/stackable-storage-boxes.jpg" },
    "facial-cleansing-brush": { name: "Electric Facial Cleansing Brush", price: 16.99, img: "/images/facial-cleansing-brush.jpg" },
    "dog-treat-ball": { name: "Interactive Treat-Dispensing Dog Ball", price: 12.99, img: "/images/dog-treat-ball.jpg" },
    "resistance-bands": { name: "Resistance Bands Set \u2014 5 Levels", price: 18.99, img: "/images/resistance-bands.jpg" }
  };

  var CART_KEY = "rivanto-cart-v1";
  var ORDER_KEY = "rivanto-last-order";
  var FREE_AT = 50;
  var DELIVERY_STANDARD = 4.95;
  var DELIVERY_EXPRESS = 9.95;

  function $(id) { return document.getElementById(id); }
  function money(n) { return "\u20ac" + n.toFixed(2); }

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function cartCount(cart) {
    var n = 0;
    for (var slug in cart) { n += cart[slug]; }
    return n;
  }
  function cartSubtotal(cart) {
    var s = 0;
    for (var slug in cart) {
      if (PRODUCTS[slug]) { s += PRODUCTS[slug].price * cart[slug]; }
    }
    return Math.round(s * 100) / 100;
  }
  function deliveryFee(subtotal, method) {
    if (method === "express") { return DELIVERY_EXPRESS; }
    return subtotal >= FREE_AT || subtotal === 0 ? 0 : DELIVERY_STANDARD;
  }
  function vatPart(gross) { return Math.round(gross * 19 / 119 * 100) / 100; }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) { t.parentNode.removeChild(t); } }, 2400);
  }

  function refreshBadge() {
    var badge = $("cartCount");
    if (!badge) { return; }
    var n = cartCount(loadCart());
    badge.textContent = n;
    badge.hidden = n === 0;
  }

  function renderDrawer() {
    var itemsEl = $("cartItems");
    if (!itemsEl) { return; }
    var cart = loadCart();
    var slugs = Object.keys(cart).filter(function (s) { return PRODUCTS[s] && cart[s] > 0; });
    var emptyEl = $("cartEmpty");
    var footEl = $("cartFoot");
    if (slugs.length === 0) {
      itemsEl.innerHTML = "";
      if (emptyEl) { emptyEl.hidden = false; }
      if (footEl) { footEl.hidden = true; }
      return;
    }
    if (emptyEl) { emptyEl.hidden = true; }
    if (footEl) { footEl.hidden = false; }
    var html = "";
    slugs.forEach(function (slug) {
      var p = PRODUCTS[slug];
      var qty = cart[slug];
      html += '<div class="cart-item">'
        + '<img src="' + p.img + '" alt="">'
        + '<div><h4>' + p.name + '</h4>'
        + '<div class="ci-price">' + money(p.price) + ' each</div>'
        + '<div class="ci-qty">'
        + '<button type="button" data-dec="' + slug + '" aria-label="Decrease quantity">\u2212</button>'
        + '<span>' + qty + '</span>'
        + '<button type="button" data-inc="' + slug + '" aria-label="Increase quantity">+</button>'
        + '<button type="button" class="ci-remove" data-remove="' + slug + '">Remove</button>'
        + '</div></div>'
        + '<div><b>' + money(p.price * qty) + '</b></div>'
        + '</div>';
    });
    itemsEl.innerHTML = html;
    var subtotal = cartSubtotal(cart);
    var fee = deliveryFee(subtotal, "standard");
    var subEl = $("cartSubtotal");
    if (subEl) { subEl.textContent = money(subtotal); }
    var delEl = $("cartDelivery");
    if (delEl) { delEl.textContent = fee === 0 ? "Free" : money(fee); }
    var noteEl = $("cartShipNote");
    if (noteEl) {
      noteEl.textContent = subtotal >= FREE_AT
        ? "You've unlocked free delivery in Germany."
        : "Add " + money(FREE_AT - subtotal) + " more for free delivery in Germany.";
    }
  }

  function openDrawer() {
    var d = $("cartDrawer"), o = $("cartOverlay");
    if (!d || !o) { return; }
    renderDrawer();
    d.hidden = false;
    o.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    var d = $("cartDrawer"), o = $("cartOverlay");
    if (!d || !o) { return; }
    d.hidden = true;
    o.hidden = true;
    document.body.style.overflow = "";
  }

  function addToCart(slug, qty, silent) {
    if (!PRODUCTS[slug]) { return; }
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var cart = loadCart();
    cart[slug] = (cart[slug] || 0) + qty;
    saveCart(cart);
    refreshBadge();
    renderDrawer();
    if (!silent) { toast("Added to basket: " + PRODUCTS[slug].name); }
  }

  function setQty(slug, qty) {
    var cart = loadCart();
    if (qty <= 0) { delete cart[slug]; }
    else { cart[slug] = qty; }
    saveCart(cart);
    refreshBadge();
    renderDrawer();
    renderCheckout();
  }

  /* ---------- checkout page ---------- */
  function deliveryMethod() {
    var r = document.querySelector('input[name="delivery"]:checked');
    return r ? r.value : "standard";
  }
  function renderCheckout() {
    var itemsEl = $("coItems");
    if (!itemsEl) { return; }
    var cart = loadCart();
    var slugs = Object.keys(cart).filter(function (s) { return PRODUCTS[s] && cart[s] > 0; });
    var emptyEl = $("coEmpty");
    var mainEl = $("coMain");
    if (slugs.length === 0) {
      if (emptyEl) { emptyEl.hidden = false; }
      if (mainEl) { mainEl.hidden = true; }
      return;
    }
    if (emptyEl) { emptyEl.hidden = true; }
    if (mainEl) { mainEl.hidden = false; }
    var html = "";
    slugs.forEach(function (slug) {
      var p = PRODUCTS[slug];
      var qty = cart[slug];
      html += '<div class="co-line">'
        + '<img src="' + p.img + '" alt="">'
        + '<div><b>' + p.name + '</b><br><span>' + qty + ' \u00d7 ' + money(p.price) + '</span></div>'
        + '<b>' + money(p.price * qty) + '</b>'
        + '</div>';
    });
    itemsEl.innerHTML = html;
    var method = deliveryMethod();
    var subtotal = cartSubtotal(cart);
    var fee = deliveryFee(subtotal, method);
    var vat = vatPart(subtotal);
    var set = function (id, v) { var el = $(id); if (el) { el.textContent = v; } };
    set("coSubtotal", money(subtotal));
    set("coVat", money(vat));
    set("coNet", money(subtotal - vat));
    set("coDelivery", fee === 0 ? "Free" : money(fee));
    set("coTotal", money(subtotal + fee));
  }

  function fieldError(input, msg) {
    input.classList.add("err");
    var err = input.parentNode.querySelector(".field-error");
    if (!err) {
      err = document.createElement("div");
      err.className = "field-error";
      input.parentNode.appendChild(err);
    }
    err.textContent = msg;
  }
  function clearError(input) {
    input.classList.remove("err");
    var err = input.parentNode.querySelector(".field-error");
    if (err) { err.parentNode.removeChild(err); }
  }

  function placeOrder(ev) {
    ev.preventDefault();
    var form = $("coForm");
    if (!form) { return; }
    var ok = true;
    var required = ["coFirst", "coLast", "coEmail", "coStreet", "coPostcode", "coCity"];
    required.forEach(function (id) {
      var input = $(id);
      if (!input) { return; }
      clearError(input);
      if (!input.value.trim()) { fieldError(input, "This field is required."); ok = false; }
    });
    var email = $("coEmail");
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      fieldError(email, "Enter a valid email address."); ok = false;
    }
    var postcode = $("coPostcode");
    if (postcode && postcode.value.trim() && !/^\d{5}$/.test(postcode.value.trim())) {
      fieldError(postcode, "Enter a 5-digit German postcode."); ok = false;
    }
    if (!ok) {
      var firstErr = form.querySelector(".err");
      if (firstErr) { firstErr.focus(); }
      return;
    }
    var cart = loadCart();
    if (cartCount(cart) === 0) { return; }
    var method = deliveryMethod();
    var subtotal = cartSubtotal(cart);
    var fee = deliveryFee(subtotal, method);
    var now = new Date();
    var num = "RV-" + now.getFullYear()
      + String(now.getMonth() + 1).padStart(2, "0")
      + String(now.getDate()).padStart(2, "0")
      + "-" + String(Math.floor(1000 + Math.random() * 9000));
    var lines = [];
    Object.keys(cart).forEach(function (slug) {
      if (!PRODUCTS[slug]) { return; }
      lines.push(cart[slug] + " x " + PRODUCTS[slug].name + " — " + money(PRODUCTS[slug].price * cart[slug]));
    });
    var order = {
      number: num,
      items: lines,
      subtotal: subtotal,
      delivery: fee,
      total: Math.round((subtotal + fee) * 100) / 100,
      method: method === "express" ? "Express delivery" : "Standard delivery",
      name: $("coFirst").value.trim() + " " + $("coLast").value.trim(),
      email: $("coEmail").value.trim(),
      phone: ($("coPhone") ? $("coPhone").value.trim() : ""),
      address: $("coStreet").value.trim() + ", " + $("coPostcode").value.trim() + " " + $("coCity").value.trim() + ", Germany",
      notes: ($("coNotes") ? $("coNotes").value.trim() : "")
    };
    try { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch (e) {}
    saveCart({});
    refreshBadge();
    var mainEl = $("coMain");
    if (mainEl) { mainEl.hidden = true; }
    var doneEl = $("coDone");
    if (doneEl) { doneEl.hidden = false; }
    var noEl = $("orderNo");
    if (noEl) { noEl.textContent = num; }
    var sumEl = $("doneSummary");
    if (sumEl) {
      sumEl.innerHTML = "<p><b>" + order.name + "</b> — " + order.email + "<br>" + order.address + "</p>"
        + "<p>" + order.items.join("<br>") + "</p>"
        + "<p>Delivery: " + order.method + " — " + (fee === 0 ? "Free" : money(fee)) + "<br>"
        + "Total: <b>" + money(order.total) + "</b> (incl. 19% VAT)</p>"
        + "<p>Payment: bank transfer (Vorkasse). We will email you the payment details.</p>";
    }
    var mailBtn = $("emailOrderBtn");
    if (mailBtn) {
      var body = "New order " + num + "\n\n"
        + "Customer: " + order.name + "\nEmail: " + order.email + "\nPhone: " + (order.phone || "-") + "\n"
        + "Delivery address: " + order.address + "\n\n"
        + "Items:\n" + order.items.join("\n") + "\n\n"
        + "Subtotal (incl. VAT): " + money(subtotal) + "\n"
        + "Delivery (" + order.method + "): " + (fee === 0 ? "Free" : money(fee)) + "\n"
        + "Total: " + money(order.total) + "\n\n"
        + "Notes: " + (order.notes || "-");
      mailBtn.href = "mailto:rivantoltd@gmail.com?subject=" + encodeURIComponent("New order " + num)
        + "&body=" + encodeURIComponent(body);
    }
    window.scrollTo(0, 0);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-add],[data-buy],[data-inc],[data-dec],[data-remove],[data-qty]");
    var btn = $("cartBtn"), closeBtn = $("cartClose"), overlay = $("cartOverlay"), cont = $("cartContinue");
    if (ev.target === btn || (btn && btn.contains(ev.target))) { openDrawer(); return; }
    if (ev.target === closeBtn || ev.target === overlay || ev.target === cont) { closeDrawer(); return; }
    if (!t) { return; }
    if (t.hasAttribute("data-add") || t.hasAttribute("data-buy")) {
      var slug = t.getAttribute("data-add") || t.getAttribute("data-buy");
      var qty = 1;
      var qtyInputId = t.getAttribute("data-qty-input");
      if (qtyInputId) {
        var qi = $(qtyInputId);
        if (qi) { qty = Math.max(1, parseInt(qi.value, 10) || 1); }
      }
      addToCart(slug, qty);
      if (t.hasAttribute("data-buy")) { window.location.href = "/checkout.html"; }
      return;
    }
    if (t.hasAttribute("data-inc") || t.hasAttribute("data-dec")) {
      var s2 = t.getAttribute("data-inc") || t.getAttribute("data-dec");
      var cart = loadCart();
      var cur = cart[s2] || 0;
      setQty(s2, cur + (t.hasAttribute("data-inc") ? 1 : -1));
      return;
    }
    if (t.hasAttribute("data-remove")) {
      setQty(t.getAttribute("data-remove"), 0);
      return;
    }
    if (t.hasAttribute("data-qty")) {
      var input = $("qty");
      if (!input) { return; }
      var v = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(t.getAttribute("data-qty"), 10));
      input.value = v;
      return;
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") { closeDrawer(); }
  });

  document.addEventListener("change", function (ev) {
    if (ev.target && ev.target.name === "delivery") { renderCheckout(); }
  });

  document.addEventListener("DOMContentLoaded", function () {
    refreshBadge();
    renderDrawer();
    renderCheckout();
    var form = $("coForm");
    if (form) { form.addEventListener("submit", placeOrder); }
    var radios = document.querySelectorAll('.radio input[type="radio"]');
    radios.forEach(function (r) {
      r.addEventListener("change", function () {
        radios.forEach(function (x) {
          var lab = x.closest(".radio");
          if (lab) { lab.classList.toggle("sel", x.checked); }
        });
      });
      var lab0 = r.closest(".radio");
      if (lab0) { lab0.classList.toggle("sel", r.checked); }
    });
  });

  /* Expose a tiny API for debugging from the console. */
  window.RIVANTO_CART = {
    add: addToCart, count: function () { return cartCount(loadCart()); },
    subtotal: function () { return cartSubtotal(loadCart()); }
  };
})();
