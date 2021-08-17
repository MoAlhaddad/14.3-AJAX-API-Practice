/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
      async function searchShows(query) {
        const params = {
          params: {
            q: query,
          },
        }
        const res = await axios.get('https://api.tvmaze.com/search/shows', params)
        const showData = res.data[0].show
        const { id, name, summary, image } = showData
        const info = [
          {
            id,
            name,
            summary,
            image: image.medium,
          },
        ]
        return info
      }
      
      /** Populate shows list:
       *     - given list of shows, add shows to DOM
       */
      
      function populateShows(shows) {
        const $showsList = $('#shows-list')
        $showsList.empty()
      
        for (let show of shows) {
          let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
               <div class="card" data-show-id="${show.id}">
                 <div class="card-body">
                 <img class="card-img-top" src=${
                   show.image ? show.image : 'https://tinyurl.com/tv-missing'
                 }>
                   <h5 class="card-title">${show.name}</h5>
                   <p class="card-text">${show.summary}</p>
                   <button class="episodes-btn">Episodes</button>
                 </div>
               </div>
             </div>
            `,
          )
      
          $showsList.append($item)
          const episodesBtn = document.querySelector('.episodes-btn')
          episodesBtn.addEventListener('click', function () {
            const eps = getEpisodes(show.id)
      
            populateEpisodes(eps)
          })
        }
      }
      
      /** Handle search form submission:
       *    - hide episodes area
       *    - get list of matching shows and show in shows list
       */
      $('#search-form').on('submit', async function handleSearch(evt) {
        evt.preventDefault()
      
        let query = $('#search-query').val()
        if (!query) return
      
        $('#episodes-area').hide()
      
        let shows = await searchShows(query)
        document.querySelector('#episodes-list').innerHTML = ''
        document.querySelector('form').reset()
        populateShows(shows)
      })
      
      /** Given a show ID, return list of episodes:
       *      { id, name, season, number }
       */
      async function getEpisodes(id) {
        const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
        return [res.data]
      }
      
      async function populateEpisodes(episodes) {
        const epList = await episodes
        const episodesList = document.querySelector('#episodes-list')
        document.querySelector('#episodes-area').style.display = 'block'
        for (let episode of epList[0]) {
          const epLi = document.createElement('li')
          epLi.innerHTML = `${episode.name} (Season: ${episode.season}, Number: ${episode.number})`
          console.log(epLi)
          episodesList.appendChild(epLi)
        }
      }