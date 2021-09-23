$(document).ready(() => {
    $('#newsSubmit').submit((e) => {
        e.preventDefault();
        
        if($.trim($('#newsTerm').val()) == ''){
            alert('Input can not be left blank');
        }else{
            $('#myHeader').empty()
            $.ajax({
                
                url: `https://newsapi.org/v2/top-headlines?language=en&q=${$('#newsTerm').val()}&apiKey=aaaaad37e47549f694b2d4f9940c4e09`,
                method: 'GET',
                dataType: 'json'
            }).then((data) => {
                $(".top-news-div").empty();
                $.each(data.articles, function(index, newsData){
                    let article = `<div class = "news-div">
                    <img src="${newsData.urlToImage}" alt="${newsData.source.name}" class="news-img"><br>
                <a href="${newsData.url}" target="_blank" class="news-title">${newsData.title}</a>
                <p class="news-desc">${newsData.description}</p>
                <p class="news-date">Date Published: ${newsData.publishedAt}</p>
                </div>`
                $(".top-news-div").append(article);
                })
                $('#myHeader').empty();
                
                let header = `Results for: ${$('#newsTerm').val()} `
                $('#myHeader').append(header)
                if(data.articles.length == 0){
                    let error = `<p> No news found for ${$('#newsTerm').val()}  within the past day`
                    $(".top-news-div").append(error);
                }
                $("#newsTerm").val("")
            })
        }
    })
})