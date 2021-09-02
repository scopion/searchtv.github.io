var search = function (datas, input_ele, content_ele) {
    var str = '<div class=\"search-result\">';
    var keywords = input_ele.value.trim().toLowerCase().split(/[\s\-]+/);
    if (input_ele.value.trim().length <= 0) {
        return;
    }
    content_ele.innerHTML = "";
    // perform local searching
    datas.forEach(function (data) {
        var isMatch = true;
        var content_index = [];
        if (!data.origin_title || data.origin_title.trim() === '') {
            data.origin_title = "Untitled";
        }
        var data_title = data.origin_title.trim().toLowerCase();
        var data_content = data.origin_title.trim().replace(/<[^>]+>/g, "").toLowerCase();
        var data_url = data.origin_url;
        var index_title = -1;
        var index_content = -1;
        var first_occur = -1;
        // only match artiles with not empty contents
        if (data_content !== '') {
            keywords.forEach(function (keyword, i) {
                index_title = data_title.indexOf(keyword);
                index_content = data_content.indexOf(keyword);

                if (index_title < 0 && index_content < 0) {
                    isMatch = false;
                } else {
                    if (index_content < 0) {
                        index_content = 0;
                    }
                    if (i == 0) {
                        first_occur = index_content;
                    }
                    // content_index.push({index_content:index_content, keyword_len:keyword_len});
                }
            });
        } else {
            isMatch = false;
        }
        // show search results
        // show search results
        if (isMatch) {
            str += "<div class='item'><a href='" + data_url + "' class='search-result-title'><h2>" + data_title + "</h2></a>";
            str += "<a>" + data_url + "</a>"
            var content = data.origin_title.trim().replace(/<[^>]+>/g, "");
            if (first_occur >= 0) {
                // cut out 100 characters
                var start = first_occur - 20;
                var end = first_occur + 80;

                if (start < 0) {
                    start = 0;
                }

                if (start == 0) {
                    end = 100;
                }

                if (end > content.length) {
                    end = content.length;
                }

                var match_content = content.substring(start, end);
                str += "<p class=\"search-result-content\">" + match_content + "...</p></div>"
            }
        }
    });
    str += "</div>";
    content_ele.innerHTML = str;
}

var searchFunc = function (path, search_id, content_id, btn_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "json",
        success: function (response) {
            // get the contents from search data
            var datas = response;
            var $input = document.getElementById(search_id);
            if (!$input) return;
            var $resultContent = document.getElementById(content_id);
            var $searchButton = document.getElementById(btn_id);
            search(datas, $input, $resultContent);
            $input.addEventListener('keydown', function (e) {
                if (e.keyCode == 13) {
                    search(datas, this, $resultContent);
                }
            });
            $searchButton.addEventListener('click', function () {
                search(datas, $input, $resultContent);
            });
        }
    });
}