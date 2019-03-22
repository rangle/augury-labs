import { TrackByDatum } from './track-by-datum.interface';

export function createDefaultTrackByData() {
  return Array(100)
    .fill(true)
    .map((_, i) => ({
      id: i,
      recentlyUpdated: false,
      content: createRandomString(),
    }))
}

export function updateTrackByData(data: TrackByDatum[], target: string, replacement: string) {
  return data.map(item => {
    const newContent = item.content.replace(target, replacement);

    return {
      id: item.id,
      recentlyUpdated: newContent !== item.content,
      content: newContent,
    };
  });
}

function createRandomString() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
