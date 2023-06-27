$(document).ready(function () {
    // Initialize variables
    var $gifArea = $('#gif-area');
    var $searchForm = $('form');
  
    // Handle form submission
    $searchForm.on('submit', async function (e) {
        e.preventDefault();
        let searchTerm = $('#search').val();
        $('#search').val('');
        await searchGiphy(searchTerm);
    });
  
    // Function to make AJAX request to Giphy API
    async function searchGiphy(searchTerm) {
        var apiKey = '3pz8DTANygTPXCbkWwfEe4sns04zZr0u';
        var url = 'http://api.giphy.com/v1/gifs/search';
  
        try {
            var res = await axios.get(url, {
                params: {
                    api_key: apiKey,
                    q: searchTerm,
                },
            });
            appendGif(res.data.data);
        } catch (error) {
                console.log(error);
            };
    }
  
    // Function to append GIFs to the page
    function appendGif(data) {
        var randomGif = Math.floor(Math.random() * data.length)
        var gif = data[randomGif];
        
        var $newCol = $('<div>', { class: 'col-md-4 col-12 mb-4' });
        var $newGif = $('<img>', { src: gif.images.fixed_height.url, class: 'w-100' });  
        
        $newCol.append($newGif);
        $gifArea.append($newCol);
    };

    $("#remove").on("click", function () {
        $gifArea.empty();
    });
});