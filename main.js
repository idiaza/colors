$(document).ready(function () {
  var KEY = 'AIzaSyASIQXP8BL0JGdN7iOHmbQ19LZfZ24jtWM';
  var URL = 'https://vision.googleapis.com/v1/images:annotate?key=' + KEY;

  var $box = $('.box');
  var $boxInput = $box.find('.box-input');
  var $colors = $('.colors');
  var $code = $('.code');

  function rgb2hex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }

  function copyToClipboard(str) {
    var el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  function makeColorCode(r, g, b) {
    return (false) ? 'rgb(' + r + ', ' + g + ', ' + b + ')' : rgb2hex(r, g, b);
  }

  function process(files) {
    var reader = new FileReader();

    reader.readAsBinaryString(files[0]);
    reader.onloadend = function (e) {
      var base64 = btoa(e.srcElement.result);

      $box.css('background-image', 'url(data:image/png;base64,' + base64 + ')');

      $.ajax({
        type: 'POST',
        url: URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          requests: [
            {
              image: {
                content: base64,
              },
              features: [
                {
                  type: 'IMAGE_PROPERTIES',
                }
              ]
            }
          ]
        }),
        success: function (data) {
          data.responses.forEach(function (response) {
            $colors.empty();

            copyToClipboard(makeColorCode(response.imagePropertiesAnnotation.dominantColors.colors[0].color.red, response.imagePropertiesAnnotation.dominantColors.colors[0].color.green, response.imagePropertiesAnnotation.dominantColors.colors[0].color.blue));

            response.imagePropertiesAnnotation.dominantColors.colors.forEach(function (color) {
              var code = makeColorCode(color.color.red, color.color.green, color.color.blue);
              var $color = $('<div class="color" style="background-color: ' + code + '"></div>');

              $color.on('click', function (e) {
                copyToClipboard(code);
                $code.text(code + ' copiado!');
              });
              $colors.append($color);
            });
          });
        },
      });
    };
  }

  $box
    .on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
    })
    .on('dragover dragenter', function () {
      $box.addClass('dragover');
    })
    .on('dragleave dragend drop', function () {
      $box.removeClass('dragover');
    })
    .on('drop', function (e) {
      process(e.originalEvent.dataTransfer.files);
    });

  $boxInput
    .on('change', function (e) {
      process(e.currentTarget.files);
    });
});
