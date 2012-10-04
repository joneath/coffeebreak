Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});

Handlebars.registerHelper("extraThumbs", function(thumbs, max) {
  var html = "",
      max = max || 2;

  _.each(thumbs, function(thumb, i) {
    if (i > max) {
      return;
    }
    html += "<img class='preview-extra-thumb' src='" + thumb.url + "'/>";
  });

  return html;
});
