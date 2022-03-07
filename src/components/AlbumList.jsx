import FetchSpotifyData from '../hooks/FetchSpotifyData';
import React, { useRef, useState, useCallback } from 'react';
import Album from './Album';
import styles from '../styles/AlbumList.module.scss';

const AlbumList = () => {
  const [pageNum, setPageNum] = useState(1)

  const {
    albums,
    moreData,
    loading
  } = FetchSpotifyData(pageNum)

  const observer = useRef()
    /*
    Whenever the element with the lastAlbumRef ref is created, it will invoke the function inside the useCallback function.
    This function will check to see if the last element/node from the albums state hook is visible on the page. If it is, it will add one to the pageNum state hook.
    This pagenumber change will trigger the FetchSpotifyData hook to request the next set of data from the Spotify albums API.
    The API request will only be called if there are more items available in the query response, than what are stored in the albums state hook.
    */
  const lastAlbumRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && moreData) {
        setPageNum(prevPageNum => prevPageNum + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, moreData])

  return (
    <div className={styles.AlbumList}>
      {
        albums.map((album, index) => {
          const isLast = albums.length === (index + 1)

          const props = {
            indexKey: album.id,
            artist: album.artists[0].name,
            album: album.name,
            image: album.images[1].url,
            date: album.release_date,
            extUrl: album.external_urls.spotify,
          }

          if (isLast) {
            props.domRef = lastAlbumRef
          }

          return (

            <Album
              {...props}
            />

          )
        })
      }
      <div>
        {loading && 'Loading...'}
      </div>
    </div>
  )
}

export default AlbumList;
