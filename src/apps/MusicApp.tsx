export function MusicApp() {
  return (
    <div className="p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Code & Coffee Playlist</h2>
        <p className="text-xs text-muted-foreground">What I listen to while building Portfolio OS — lo-fi, ambient electronic, late-night focus tracks.</p>
      </div>
      <iframe
        title="Spotify"
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0"
        width="100%"
        height="380"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
      />
    </div>
  );
}
