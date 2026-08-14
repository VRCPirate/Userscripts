// ==UserScript==
// @name        VRCPirate for booth.pm
// @namespace   Violentmonkey Scripts
// @match       https://booth.pm/en/items/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      doclan
// @description 2026/8/10 14:22:14
// ==/UserScript==

$(document).ready(() => {
  const bid = window.location.pathname.split('items/')[1];
  if(!bid)
    return console.log("[VRCPirate] SOMETHING WENT WRONG");

  const downloadBox = $('<div></div>');
  const mainText = $('<p></p>');
  downloadBox.append(mainText);

  $($('#variations').parent()).before(downloadBox);

  GM_xmlhttpRequest({
    method: "GET",
    url: `https://api-v2.vrcpirate.com/assets?page=1&search=${bid}`,
    onload: function(response) {
      const data = JSON.parse(response.responseText);
      if(data.meta.totalItems > 0)
      {
        mainText.html(`[🟢] <a href="https://vrcpirate.com/iviewer/${data.data[0].id}" target="__blank">Click Here</a>`);
      }
    }
  });

  console.log("[VRCPirate] UserScript Loaded!");
})
