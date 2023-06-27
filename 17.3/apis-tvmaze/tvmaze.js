"use strict";

$(document).ready(function () {
  $(document).on('click', '.episodes-button', async function () {
    const showId = $(this).data('show-id');
    const episodes = await getEpisodesOfShow(showId);
    populateEpisodes(episodes);
  });
});

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


function searchTVShows(searchTerm) {
  const apiUrl = `http://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`;

  return axios.get(apiUrl)
    .then(response => {
      return response.data.map(item => {
        const { id, name, summary } = item.show;
        const image = item.show.image ? item.show.image.medium : 'https://tinyurl.com/tv-missing';

        return { id, name, summary, image };
      });
    });
}

async function getShowsByTerm(term) {
  const shows = await searchTVShows(term);
  return shows;
}

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
          <div class="media custom-media-class">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm episodes-button">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const apiUrl = `http://api.tvmaze.com/shows/${id}/episodes`;

  return axios.get(apiUrl)
  .then(response => {
    return response.data.map(episode => {
      const { id, name, season, number } = episode;
      return { id, name, season, number };
    });
  });

}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  const episodesList = $('#episodes-list');
  episodesList.empty();

  episodes.forEach(episode => {
    const { id, name, season, number } = episode;
    const episodeItem = $('<li>').text(`${name} (season ${season}, number ${number})`);
    episodeItem.attrd('data-episode-id', id);
    episodesList.append(episodeItem);
  });

  $episodesArea.show();
}
