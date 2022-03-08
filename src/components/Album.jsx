import React from 'react';
import styles from '../styles/Album.module.scss';

const Album = ({ indexKey, artist, album, image, date, extUrl, domRef }) => {
    /*
    Will rerender the current window to google's website if any of the DOM elements with an ID of "Album" are clicked.
    Else, it will open a new tab that redirects to the Spotify album that was clicked on using the "See On Spotify" button, and then focus that tab.
   */
  const handleClick = (e) => {

    e.stopPropagation()
    window.open(extUrl, '_blank').focus();
    }
  }

  return (
    <div className={styles.Album} id="Album"  key={indexKey} ref={domRef}  >
      <div className={styles.Cover} id="Album">
        <img src={image} alt="Album Cover Art" />
      </div>
      <div className={styles.Details} id="Album">
        <h1>
          {artist}
        </h1>
        <h2>
          {album}
        </h2>
        <p>
          Album release date: {date}
        </p>
        <button id="button" >See On Spotify</button>
      </div>
    </div>
  )
}

export default Album;