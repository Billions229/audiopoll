Pour jouer un **audio en arrière-plan persistant** dans une application Next.js, indépendamment des changements de page ou des animations, il faut utiliser un **layout global** qui enveloppe toutes les pages et maintient l’état du lecteur audio entre les navigations.[1][2]

### Solution : Utiliser un Layout Global dans `_app.js`

La clé est de **ne pas démonter le composant audio** lors des changements de route. Cela se fait en plaçant le lecteur audio dans un composant layout qui persiste à travers toutes les pages, grâce à la personnalisation de `_app.js`.[2][1]

Voici les étapes :

1. **Créez un composant `Layout`** qui contient votre lecteur audio :
```jsx
// components/Layout.js
import { useState } from 'react';

export default function Layout({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioSrc = '/background-music.mp3'; // Placez votre fichier dans /public

  return (
    <>
      {children}
      <audio
        src={audioSrc}
        autoPlay
        loop
        muted={!isPlaying}
        style={{ display: 'none' }}
      />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'} Music
      </button>
    </>
  );
}
```

2. **Enveloppez votre application avec ce layout dans `_app.js`** :
```jsx
// pages/_app.js
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
```

### Pourquoi ça marche ?

- Next.js recrée l’arbre React à chaque navigation, **sauf** pour les composants dans `_app.js`.
- En plaçant le `<audio>` dans `Layout`, il **n’est jamais démonté**, donc la lecture continue.
- L’état (`isPlaying`) est conservé grâce à `useState` dans le composant parent persistant.[1][2]

### Alternative : Gestion d’état centralisée

Pour un contrôle plus fin (ex: changer de piste depuis n’importe quelle page), utilisez **React Context** ou un state manager comme Zustand :
```jsx
// context/AudioContext.js
import { createContext, useContext, useState } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState('/music1.mp3');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AudioContext.Provider value={{ currentTrack, setCurrentTrack, isPlaying, setIsPlaying }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
```

Puis enveloppez `_app.js` avec `AudioProvider`.[3][4]

Ainsi, l’audio continue de jouer **sans interruption**, peu importe les animations ou les changements de page.[2][1]

[1](https://stackoverflow.com/questions/48518784/next-js-change-page-without-stop-the-audio)
[2](https://github.com/vercel/next.js/issues/8441)
[3](https://blog.openreplay.com/building-a-music-entertainment-application-with-reactjs-nextjs-algolia-and-firebase/)
[4](https://blog.logrocket.com/guide-state-management-next-js/)
[5](https://www.reddit.com/r/webdev/comments/10xb3lz/how_can_i_play_an_audio_through_different_webpages/)
[6](https://stackoverflow.com/questions/71528136/nextjs-how-to-stop-audio-from-playing-when-route-changes)
[7](https://github.com/katspaugh/wavesurfer.js/discussions/3190)
[8](https://nextjs.org/learn/dashboard-app/streaming)
[9](https://www.youtube.com/watch?v=8sDto47tLfE)
[10](https://stackoverflow.com/questions/67456770/how-can-i-play-audio-in-background-in-next-js)
[11](https://github.com/vercel/next.js/discussions/48427)
[12](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
[13](https://nextjs.org/docs/app/guides/videos)
[14](https://nextjs.org/docs/14/app/building-your-application/routing/loading-ui-and-streaming)
[15](https://github.com/designly1/next-audio-player-example)
[16](https://www.sitepoint.com/community/t/continuous-music/5386)
[17](https://www.reddit.com/r/nextjs/comments/1ixnkjs/should_i_use_nextjs_api_routes_for_an_audioheavy/)
[18](https://www.geeksforgeeks.org/reactjs/music-player-app-with-next-js-and-api/)
[19](https://www.youtube.com/watch?v=SIS3Q7zOMPI)
[20](https://www.fastpix.io/blog/autoplaying-videos-in-next-js-applications)
