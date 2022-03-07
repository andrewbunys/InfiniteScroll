import { useState, useEffect } from 'react';
import axios from 'axios';

const FetchSpotifyData = (pageNum) => {
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [moreData, setMoreData] = useState(false);
  const [token, setToken] = useState();
  const [nextQuery, setNextQuery] = useState();

  const SPOTIFY_TOKEN_API = 'https://accounts.spotify.com/api/token';
  const SPOTIFY_ALBUMS_API = 'https://api.spotify.com/v1/artists/1dfeR4HaWDbWqFHLkxsg1d/albums';
  const CLIENT_ID = 'd900834c1db44a65a62d421a498cb927';
  const CLIENT_SECRET = 'f7df2deb18ca4619a695ac33773b5196';

    //Queries the Spotify token API and stores the response, a bearer token, in the token state hook.
  useEffect(() => {

    let getToken = async () => {
      let token = await axios({
        method: 'post',
        url: SPOTIFY_TOKEN_API,
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Authorization' : 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        data: 'grant_type=client_credentials',
      })
      setToken(token.data.access_token);
    }

    getToken()

  }, [])

    /*
    Queries the Spotify Albums API and stores the response items in the albums state hook. The query uses limit and offset to paginate and will only query for 10 items per request.
    The useEffect dependencies array watches for the token hook to update with an API bearer token and for the pageNum state to change. A change to either of these values will result in another get request being called.
    */
  useEffect(() => {

    let getAlbums = async () => {
      let albums = await axios.get(nextQuery ? nextQuery : SPOTIFY_ALBUMS_API, {
            params: {
              limit: 10,
              offset: 0
          },
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        setNextQuery(albums.data.next)
        setAlbums(prevAlbums => {
                return [...prevAlbums, ...albums.data.items]
              })
        setMoreData(albums.data.items.length === 10)
        setLoading(false)
    }

    getAlbums()

    }, [pageNum, token])

  return { loading, albums, moreData }
}

export default FetchSpotifyData;