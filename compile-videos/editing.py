from moviepy.editor import *
from env import is_prod
import re

videos_path = "../../downloads/" if is_prod() else "../../dev_downloads/"
music_path = "../../music/"

def get_real_audio_path(path):
  m = re.search('.+/([^/]+)', path)
  return music_path + m.group(1)

def process_clip(info, resolution):
  clip = VideoFileClip(videos_path + info['id'] + ".mp4")
  clip = pad_clip_to_size(resolution, clip)
  clip = trim_clip((info['media']['start'], info['media']['end']), clip)

  if info['media']['selectedMusicFile'] != '':
      new_audio = AudioFileClip(get_real_audio_path(info['media']['selectedMusicFile']))
      clip = add_audio(new_audio, info['media']['musicRangeValue'], clip)
  elif info['media']['isMuted']:
      clip = clip.set_audio(None)
  return clip

def pad_clip_to_size(total_size, clip):
  if clip.size[0] / clip.size[1] >= total_size[0] / total_size[1]:
    clip1 = clip.resize(width=total_size[0])
  else:
    clip1 = clip.resize(height=total_size[1])

  # return CompositeVideoClip([clip1.set_pos('center')], size=total_size)
  return clip1


def trim_clip(subclips, clip):
  if not isinstance(subclips, list):
    subclips = [subclips]
  cut = list(map(lambda sub: clip.subclip(sub[0], sub[1]), subclips))
  if len(cut) > 1:
    out = concatenate_videoclips(cut, method="compose")
  else:
    out = cut[0]
  return out


def add_audio(audio_clip, audio_clip_start, video_clip):
  audio_clip = audio_clip.subclip(audio_clip_start)
  if audio_clip.duration > video_clip.duration:
    audio_clip = audio_clip.subclip(0, video_clip.duration)
  out = video_clip.set_audio(audio_clip)
  return out
