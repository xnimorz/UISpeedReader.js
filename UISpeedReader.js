(function($) {
    'use strict';
    var htmlTemplate = '<div class="ui-speed-reader">\
        <div class="ui-speed-reader-textarea">\
        <div class="ui-speed-reader__line ui-speed-reader__line_top"></div>\
        <div class="ui-speed-reader__text">\
        <pre class="ui-speed-reader__data">          <span>3</span></pre>\
        </div>\
        <div class="ui-speed-reader__line ui-speed-reader__line_bottom"></div>\
    </div>\
        <a class="ui-speed-reader__command ui-speed-reader__start">start</a>\
        <a class="ui-speed-reader__command ui-speed-reader__pause">pause</a>\
        <a class="ui-speed-reader__command ui-speed-reader__stop">stop</a>\
        <select class="ui-speed-reader__speed">\
            <option value="100">100</option>\
            <option value="150">150</option>\
            <option value="200" selected>200</option>\
            <option value="250">250</option>\
            <option value="300">300</option>\
            <option value="400">400</option>\
            <option value="500">500</option>\
            <option value="600">600</option>\
            <option value="800">800</option>\
        </select>\
    </div>';

    $.fn.uiSpeedReader = function(getTextFunction){
        var $this = this,
            speed = 250,
            index = 3,
            timer = null,
            secPerMinute = 1000 * 60,
            text = getTextFunction(),
            textArray = text.split(/[\s\n\/]/),
            avgLength = 10;

        var pasteWord = function(word) {

            var wordLength = word.length;
            wordLength = Math.round(wordLength / 3);
            var spaces = avgLength - wordLength;
            var resStr = '';

            resStr += word.slice(0,wordLength);
            resStr += '<span>' + word[wordLength] + '</span>';
            resStr += word.slice(wordLength + 1, word.length);

            for (var i = 0; i < spaces; i++) {
                resStr = ' ' + resStr;
            }

            $('.ui-speed-reader__data').html(resStr);

        };

        var textIndex = 0;
        var readFunction = function() {
            while (textArray[textIndex] === '' && textArray.length > textIndex) {
                textIndex++;
            }
            if (textArray.length > textIndex) {
                pasteWord(textArray[textIndex++]);
            } else {
                pasteWord('Текст прочитан');
                clearInterval(timer);
                textIndex = 0;
            }
        };

        var getSpeed = function() {
            speed = $('.ui-speed-reader__speed').val();
        };

        var startFunction = function() {
            $('.ui-speed-reader__data span').html(--index);
            if (index === 0) {
                clearInterval(timer);
                getSpeed();
                timer = setInterval(readFunction, secPerMinute / speed);
                index = 3;
            }
        };

        var pause = function() {
            clearInterval(timer);
        };

        $this.append(htmlTemplate);

        $this.on('click', '.ui-speed-reader__start', function() {
            var newText = getTextFunction();
            if (text !== newText) {
                text = newText;
                textArray = text.split(/[\s\n\/]/);
                textIndex = 0;
            }
            index = 3;
            $('.ui-speed-reader__data').html('          <span>3</span>');
            timer = setInterval(startFunction, secPerMinute / speed);
        })

            .on('click', '.ui-speed-reader__pause', pause)
            .on('change click', '.ui-speed-reader__speed', pause)
            .on('click', '.ui-speed-reader__stop', function() {
                textIndex = 0;
                clearInterval(timer);
            });

    };
})(jQuery);
